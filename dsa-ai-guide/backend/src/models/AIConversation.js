const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  contextMetadata: {
    topicSlug: String,
    problemSlug: String,
    codeSnippet: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const aiConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    topicSlug: {
      type: String,
      default: ''
    },
    problemSlug: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'New Mentoring Session'
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIConversation', aiConversationSchema);
