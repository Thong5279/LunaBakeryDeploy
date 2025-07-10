const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Cho phép chat ẩn danh
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  sessionId: {
    type: String,
    required: true
  },
  context: {
    lastTopic: {
      type: String,
      default: null
    },
    userPreferences: [{
      type: String
    }],
    conversationFlow: [{
      timestamp: Date,
      userIntent: String,
      responded: Boolean
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat; 