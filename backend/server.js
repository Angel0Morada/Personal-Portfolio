require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const articleRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (with memory fallback check)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articleRoutes);

// Wildcard status check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AetherPress REST API',
    endpoints: {
      status: '/api/articles/status',
      articles: '/api/articles'
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
