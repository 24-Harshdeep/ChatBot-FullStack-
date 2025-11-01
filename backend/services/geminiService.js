const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODE_PROMPTS = {
  developer: `You are a Developer Assistant AI. Your personality is:
- Concise and technical
- Logical and methodical
- Expert in programming languages, frameworks, and best practices
- Provide code examples and debugging help
- Use technical jargon appropriately
- Focus on efficiency and optimization

Answer questions with precision and include code snippets when relevant.`,

  learner: `You are a Learning and Tutoring AI. Your personality is:
- Encouraging and supportive
- Patient and didactic
- Break down complex concepts into simple steps
- Use analogies and examples to explain
- Celebrate progress and achievements
- Make learning fun and engaging
- Ask questions to ensure understanding

Help users learn and grow their skills with enthusiasm.`,

  hr: `You are an HR and IT Operations Assistant. Your personality is:
- Polished and professional
- Supportive and empathetic
- Process-driven and organized
- Clear in communication
- Helpful with policies and procedures
- Maintain confidentiality and professionalism

Assist with HR queries, IT support, and operational matters in a professional manner.`
};

async function sendMessage(message, mode, conversationHistory = [], fileData = null) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return `⚠️ **Gemini API Key Not Configured**\n\nTo enable AI responses, please:\n1. Get your API key from https://makersuite.google.com/app/apikey\n2. Add it to the \`.env\` file:\n   \`GEMINI_API_KEY=your_actual_key_here\`\n3. Restart the backend server\n\n**Your message**: ${message}\n\n*This is a placeholder response. Configure the API key to get real AI responses.*`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Check if file is an image
    const isImage = fileData && fileData.mimetype && fileData.mimetype.startsWith('image/');
    
    if (isImage) {
      // Handle image with vision
      const imageParts = [{
        inlineData: {
          data: fileData.content.toString('base64'),
          mimeType: fileData.mimetype
        }
      }];
      
      // Build context with system prompt
      const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.developer;
      let prompt = `${systemPrompt}\n\n`;
      
      // Add conversation history
      if (conversationHistory.length > 0) {
        prompt += 'Conversation history:\n';
        conversationHistory.forEach(msg => {
          prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        prompt += '\n';
      }
      
      prompt += `User: ${message}`;
      
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      return response.text();
    } else {
      // Handle text-based content
      // Build context with system prompt and conversation history
      const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.developer;
      
      let prompt = `${systemPrompt}\n\n`;
      
      // Add conversation history
      if (conversationHistory.length > 0) {
        prompt += 'Conversation history:\n';
        conversationHistory.forEach(msg => {
          prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        prompt += '\n';
      }
      
      // If file data is provided, add it to the prompt
      if (fileData) {
        prompt += `\n**File Information:**\n`;
        prompt += `- File Name: ${fileData.filename}\n`;
        prompt += `- File Type: ${fileData.mimetype}\n`;
        prompt += `- File Size: ${fileData.size} bytes\n\n`;
        prompt += `**File Content:**\n${fileData.content}\n\n`;
      }
      
      prompt += `User: ${message}\nAssistant:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return `⚠️ **AI Response Error**\n\nThere was an error generating the AI response. Please check:\n- Your API key is valid\n- You have API quota available\n- Your internet connection is working\n\n**Your message**: ${message}\n\n*Error: ${error.message}*`;
  }
}

async function generateChatTitle(firstMessage) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      // Generate a simple title from the first message
      const words = firstMessage.split(' ').slice(0, 5).join(' ');
      return words.length > 40 ? words.substring(0, 37) + '...' : words;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Generate a short, descriptive title (max 6 words) for a chat that starts with this message: "${firstMessage}". Only respond with the title, nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let title = response.text().trim();
    
    // Remove quotes if present
    title = title.replace(/^["']|["']$/g, '');
    
    // Truncate if too long
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    return title;
  } catch (error) {
    console.error('Title generation error:', error);
    // Fallback to first few words of message
    const words = firstMessage.split(' ').slice(0, 5).join(' ');
    return words.length > 40 ? words.substring(0, 37) + '...' : words;
  }
}

module.exports = {
  sendMessage,
  generateChatTitle
};
