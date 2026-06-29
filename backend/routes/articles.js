const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const dbConfig = require('../config/db');

// Helper to calculate reading time in minutes
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content ? content.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// GET status
router.get('/status', (req, res) => {
  const isFallback = dbConfig.getFallbackMode();
  res.json({
    status: 'online',
    fallbackMode: isFallback,
    database: isFallback ? 'In-Memory Cache (MongoDB Offline)' : 'MongoDB Server Connected',
    timestamp: new Date()
  });
});

// GET all articles
router.get('/', async (req, res) => {
  try {
    if (dbConfig.getFallbackMode()) {
      const memoryArticles = dbConfig.getMemoryStore();
      // Sort by createdAt descending
      const sorted = [...memoryArticles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(sorted);
    } else {
      const articles = await Article.find().sort({ createdAt: -1 });
      return res.json(articles);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET specific article
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (dbConfig.getFallbackMode()) {
      const memoryArticles = dbConfig.getMemoryStore();
      const article = memoryArticles.find(art => art._id === id);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      return res.json(article);
    } else {
      const article = await Article.findById(id);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      return res.json(article);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create article
router.post('/', async (req, res) => {
  const { title, subtitle, content, category, tags, coverImage } = req.body;
  const readingTime = calculateReadingTime(content);
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const parsedTags = Array.isArray(tags) 
    ? tags 
    : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

  if (dbConfig.getFallbackMode()) {
    const memoryArticles = dbConfig.getMemoryStore();
    const newArticle = {
      _id: 'mem-' + Math.random().toString(36).substr(2, 9),
      title,
      subtitle: subtitle || '',
      content,
      category: category || 'General',
      tags: parsedTags,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      likes: 0,
      readingTime,
      createdAt: new Date().toISOString()
    };
    memoryArticles.push(newArticle);
    dbConfig.setMemoryStore(memoryArticles);
    return res.status(201).json(newArticle);
  } else {
    try {
      const newArticle = new Article({
        title,
        subtitle,
        content,
        category: category || 'General',
        tags: parsedTags,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
        readingTime
      });
      const savedArticle = await newArticle.save();
      return res.status(201).json(savedArticle);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
});

// PUT update article
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, subtitle, content, category, tags, coverImage } = req.body;
  const readingTime = content ? calculateReadingTime(content) : undefined;
  
  const parsedTags = tags !== undefined 
    ? (Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean))
    : undefined;

  if (dbConfig.getFallbackMode()) {
    const memoryArticles = dbConfig.getMemoryStore();
    const index = memoryArticles.findIndex(art => art._id === id);
    if (index === -1) return res.status(404).json({ message: 'Article not found' });
    
    const updated = {
      ...memoryArticles[index],
      title: title !== undefined ? title : memoryArticles[index].title,
      subtitle: subtitle !== undefined ? subtitle : memoryArticles[index].subtitle,
      content: content !== undefined ? content : memoryArticles[index].content,
      category: category !== undefined ? category : memoryArticles[index].category,
      tags: parsedTags !== undefined ? parsedTags : memoryArticles[index].tags,
      coverImage: coverImage !== undefined ? coverImage : memoryArticles[index].coverImage,
      readingTime: readingTime !== undefined ? readingTime : memoryArticles[index].readingTime,
      updatedAt: new Date().toISOString()
    };
    
    memoryArticles[index] = updated;
    dbConfig.setMemoryStore(memoryArticles);
    return res.json(updated);
  } else {
    try {
      const article = await Article.findById(id);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      
      if (title !== undefined) article.title = title;
      if (subtitle !== undefined) article.subtitle = subtitle;
      if (content !== undefined) {
        article.content = content;
        article.readingTime = readingTime;
      }
      if (category !== undefined) article.category = category;
      if (tags !== undefined) article.tags = parsedTags;
      if (coverImage !== undefined) article.coverImage = coverImage;
      
      const updatedArticle = await article.save();
      return res.json(updatedArticle);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
});

// DELETE article
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (dbConfig.getFallbackMode()) {
    const memoryArticles = dbConfig.getMemoryStore();
    const filtered = memoryArticles.filter(art => art._id !== id);
    if (filtered.length === memoryArticles.length) {
      return res.status(404).json({ message: 'Article not found' });
    }
    dbConfig.setMemoryStore(filtered);
    return res.json({ message: 'Article deleted successfully' });
  } else {
    try {
      const article = await Article.findById(id);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      await article.deleteOne();
      return res.json({ message: 'Article deleted successfully' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
});

// POST like article
router.post('/:id/like', async (req, res) => {
  const id = req.params.id;
  if (dbConfig.getFallbackMode()) {
    const memoryArticles = dbConfig.getMemoryStore();
    const index = memoryArticles.findIndex(art => art._id === id);
    if (index === -1) return res.status(404).json({ message: 'Article not found' });
    
    memoryArticles[index].likes = (memoryArticles[index].likes || 0) + 1;
    dbConfig.setMemoryStore(memoryArticles);
    return res.json(memoryArticles[index]);
  } else {
    try {
      const article = await Article.findById(id);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      
      article.likes = (article.likes || 0) + 1;
      const updatedArticle = await article.save();
      return res.json(updatedArticle);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
});

module.exports = router;
