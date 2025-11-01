const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  preferences: {
    defaultMode: {
      type: String,
      enum: ['developer', 'learner', 'hr'],
      default: 'developer'
    },
    themes: {
      developer: {
        type: String,
        default: 'neural-blue'
      },
      learner: {
        type: String,
        default: 'aurora-teal'
      },
      hr: {
        type: String,
        default: 'solar-amber'
      }
    },
    darkMode: {
      type: Boolean,
      default: true
    },
    animationsEnabled: {
      type: Boolean,
      default: true
    },
    xpVisible: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalChats: {
      type: Number,
      default: 0
    },
    favoriteMode: {
      type: String,
      default: 'developer'
    },
    learningXP: {
      type: Number,
      default: 0
    },
    streakDays: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  integrations: {
    github: {
      connected: {
        type: Boolean,
        default: false
      },
      username: String
    },
    slack: {
      connected: {
        type: Boolean,
        default: false
      },
      workspaceId: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
