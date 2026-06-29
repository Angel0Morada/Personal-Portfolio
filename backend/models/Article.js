const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  coverImage: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', ArticleSchema);
