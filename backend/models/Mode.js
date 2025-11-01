const mongoose = require('mongoose');

const modeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['developer', 'learner', 'hr']
  },
  displayName: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  systemPrompt: {
    type: String,
    required: true
  },
  themes: [{
    name: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    },
    colors: {
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      backgroundGradient: [String],
      text: String,
      textSecondary: String,
      userBubble: String,
      aiBubble: String,
      border: String
    }
  }],
  greeting: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Mode', modeSchema);
