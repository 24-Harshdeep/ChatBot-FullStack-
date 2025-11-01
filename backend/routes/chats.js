const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateChatTitle, sendMessage } = require('../services/geminiService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow text files, code files, PDFs, and images
    const allowedTypes = [
      // Text files
      'text/plain',
      'text/csv',
      'application/pdf',
      'application/json',
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp'
    ];
    
    // Also allow files based on extension
    const allowedExtensions = [
      // Text
      '.txt', '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', 
      '.css', '.html', '.json', '.md', '.pdf', '.doc', '.docx', '.csv',
      // Images
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only text-based files and images are allowed.'));
    }
  }
});

// Create a new chat
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { mode, message } = req.body;
    let fileData = null;

    // Process uploaded file if present
    if (req.file) {
      try {
        const isImage = req.file.mimetype.startsWith('image/');
        const fileContent = isImage 
          ? await fs.readFile(req.file.path) // Read as buffer for images
          : await fs.readFile(req.file.path, 'utf-8'); // Read as text for other files
        
        fileData = {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          content: fileContent
        };
        
        // Delete the file after reading
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('File reading error:', error);
        return res.status(400).json({ message: 'Error processing file' });
      }
    }

    const chat = new Chat({
      userId: req.userId,
      mode,
      messages: [{
        role: 'user',
        content: message,
        attachments: req.file ? [{
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        }] : []
      }]
    });

    // Generate AI response with file data
    const aiResponse = await sendMessage(message, mode, [], fileData);
    
    chat.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    // Generate title based on first message
    const title = await generateChatTitle(message);
    chat.title = title;

    await chat.save();

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.totalChats': 1 }
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all chats for a user
router.get('/', auth, async (req, res) => {
  try {
    const { mode, startDate, endDate, keyword } = req.query;
    
    let query = { userId: req.userId };
    
    // Filter by mode
    if (mode) {
      query.mode = mode;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Filter by keyword in title
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }

    const chats = await Chat.find(query)
      .sort({ isPinned: -1, updatedAt: -1 })
      .select('-messages'); // Don't send all messages, just metadata

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message in an existing chat
router.post('/:id/message', auth, upload.single('file'), async (req, res) => {
  try {
    const { message } = req.body;
    let fileData = null;

    // Process uploaded file if present
    if (req.file) {
      try {
        const isImage = req.file.mimetype.startsWith('image/');
        const fileContent = isImage 
          ? await fs.readFile(req.file.path) // Read as buffer for images
          : await fs.readFile(req.file.path, 'utf-8'); // Read as text for other files
        
        fileData = {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          content: fileContent
        };
        
        // Delete the file after reading
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('File reading error:', error);
        return res.status(400).json({ message: 'Error processing file' });
      }
    }
    
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      attachments: req.file ? [{
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      }] : []
    });

    // Generate AI response with conversation history and file data
    const conversationHistory = chat.messages.slice(-10); // Last 10 messages for context
    const aiResponse = await sendMessage(message, chat.mode, conversationHistory, fileData);
    
    chat.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await chat.save();

    // Return only the new messages
    const newMessages = chat.messages.slice(-2);
    res.json({
      chatId: chat._id,
      messages: newMessages
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update chat (rename, pin/unpin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, isPinned } = req.body;
    
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (title !== undefined) chat.title = title;
    if (isPinned !== undefined) chat.isPinned = isPinned;

    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a chat
router.delete('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
