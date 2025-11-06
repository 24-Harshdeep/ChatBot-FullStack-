const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chats');
const modeRoutes = require('./routes/modes');

// Import seed function
const { seedModes } = require('./config/seedModes');

const app = express();

/* ======================================================
   ✅ 1. CORS Configuration — Secure & Flexible
====================================================== */
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.LOCAL_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://chat-bot-full-stack.vercel.app', // Vercel main
];

// Helper: allow any Vercel preview (e.g. *.vercel.app)
const isVercelPreview = (origin) =>
  origin && origin.endsWith('.vercel.app');

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests without Origin (e.g. Postman)
      if (allowedOrigins.includes(origin) || isVercelPreview(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from: ${origin}`);
        callback(new Error('CORS not allowed'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

/* ======================================================
   ✅ 2. Middleware
====================================================== */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ======================================================
   ✅ 3. API Routes
====================================================== */
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/modes', modeRoutes);

/* ======================================================
   ✅ 4. Health Check Route
====================================================== */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running successfully 🚀',
    environment: process.env.NODE_ENV || 'development',
  });
});

/* ======================================================
   ⚠️ 5. Fallback for Unknown Routes
====================================================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

/* ======================================================
   🚨 6. Centralized Error Handler
====================================================== */
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

/* ======================================================
   🧩 7. MongoDB Connection + Server Start
====================================================== */
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptive-chatbot';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedModes();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('📡 Allowed origins:');
      allowedOrigins.forEach((url) => console.log(`   - ${url}`));
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

/* ======================================================
   🔐 8. Handle Unhandled Promise Rejections
====================================================== */
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err.message);
  process.exit(1);
});
