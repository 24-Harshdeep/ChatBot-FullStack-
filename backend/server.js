const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chats');
const modeRoutes = require('./routes/modes');

// Import seed function
const { seedModes } = require('./config/seedModes');

const app = express();

// ✅ Allowed origins (main + preview URLs)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://chat-bot-full-stack.vercel.app', // Vercel main domain
];

// ✅ Helper: Allow Vercel preview subdomains
const isVercelPreview = (origin) =>
  origin && origin.endsWith('.vercel.app');

// ✅ CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser tools
      if (allowedOrigins.includes(origin) || isVercelPreview(origin)) {
        return callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from origin: ${origin}`);
        return callback(new Error('CORS not allowed'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Preflight (OPTIONS) requests
app.options('*', cors());

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/modes', modeRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running successfully 🚀',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ✅ Unknown route handler (avoid 404 noise)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

// ✅ MongoDB connection + Server start
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptive-chatbot';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedModes();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Allowed origins:`);
      allowedOrigins.forEach((url) => console.log(`   - ${url}`));
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// ✅ Handle unhandled rejections safely
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err.message);
  process.exit(1);
});
