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

// ✅ Allowed origins (add your deployed frontend URL here)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://chat-bot-full-stack-t6ls.vercel.app', // your production frontend
];

// ✅ Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS error: This origin (${origin}) is not allowed.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
app.use('/users', userRoutes);
app.use('/chats', chatRoutes);
app.use('/modes', modeRoutes);

// ✅ Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running successfully!' });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// ✅ Database connection + server start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptive-chatbot';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedModes();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// ✅ Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err);
});
