const mongoose = require('mongoose');

let isFallbackMode = false;
let memoryStore = []; // Array to store articles in memory when falling back

// Pre-seeded articles for immediate out-of-the-box experience
const seedArticles = [
  {
    _id: "seed-art-1",
    title: "The Art of Glassmorphism in Modern UI/UX",
    subtitle: "How to craft beautiful frosted-glass interfaces that feel premium.",
    content: "Glassmorphism is a UI design trend that mimics the look of frosted glass. It features a translucent, blurred background, subtle border highlights, and vibrant underlying shapes. By utilizing CSS properties like `backdrop-filter: blur(20px)` and semi-transparent border lines, designers can create interfaces that feel incredibly premium and organic.\n\nTo make it look spectacular, ensure you use layered cards with subtle dropshadows, high-contrast typography, and glowing gradients placed directly behind the translucent elements. Modern web browsers support these effects with high performance, enabling smooth animations and transitions.",
    category: "Design",
    tags: ["UI/UX", "CSS", "Design System"],
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    likes: 42,
    readingTime: 3,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString() // 2 days ago
  },
  {
    _id: "seed-art-2",
    title: "Building Resilient Full-Stack Apps with MERN",
    subtitle: "A developer's guide to offline database fallback strategies.",
    content: "When developing MERN stack applications locally, one common developer friction point is database setup. If MongoDB isn't running on the target machine, the backend server crashes or hangs.\n\nImplementing a robust check in your database connection utility allows the server to detect connection failures. Once detected, the server can dynamically direct queries to a thread-safe, in-memory collection cache. This ensures the app is immediately bootable and testable, boosting first-time setup experience significantly.",
    category: "Technology",
    tags: ["MERN", "MongoDB", "Node.js", "Express"],
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    likes: 27,
    readingTime: 4,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
  },
  {
    _id: "seed-art-3",
    title: "Micro-Animations: The Secret to User Engagement",
    subtitle: "Enhancing digital products with delightful interactive details.",
    content: "Micro-animations are subtle visual responses to user actions—like a button swelling slightly when hovered, a heart icon bouncing on like, or a sleek page-transition sliding in. These details build a sense of responsiveness, making the web application feel alive and responsive.\n\nUse CSS transitions or small GSAP libraries, keeping animations quick (under 300ms) and natural. Over-animating can distract, but precise, context-aware micro-animations lead to a 20-30% increase in interface feedback approval.",
    category: "Design",
    tags: ["Animations", "UX", "Microinteractions"],
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    likes: 88,
    readingTime: 2,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString() // 3 hours ago
  }
];

// Initialize in-memory cache with seeds
memoryStore = [...seedArticles];

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aetherpress';
  
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect with a 3 second timeout for quick fallback
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB connected successfully!');
    isFallbackMode = false;
    
    // Seed DB if empty
    try {
      const Article = require('../models/Article');
      const count = await Article.countDocuments();
      if (count === 0) {
        console.log('Database is empty. Seeding initial articles...');
        const seedsWithoutId = seedArticles.map(({ _id, ...rest }) => rest);
        await Article.insertMany(seedsWithoutId);
        console.log('Database seeded successfully!');
      }
    } catch (seedErr) {
      console.warn('Warning: Could not seed initial database articles:', seedErr.message);
    }
  } catch (error) {
    console.warn('\n=============================================================');
    console.warn('WARNING: Could not connect to local MongoDB database.');
    console.warn(`Reason: ${error.message}`);
    console.warn('FALLBACK ACTIVATED: Operating in In-Memory Mode.');
    console.warn('Changes will not be written to disk. Run MongoDB to persist changes.');
    console.warn('=============================================================\n');
    isFallbackMode = true;
  }
};

module.exports = {
  connectDB,
  getFallbackMode: () => isFallbackMode,
  getMemoryStore: () => memoryStore,
  setMemoryStore: (newStore) => { memoryStore = newStore; }
};
