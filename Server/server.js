import 'dotenv/config'; // Add this at the top to load .env variables
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initSocket } from './services/socket.js';
import pageRoutes from './routes/pages.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import technologyRoutes from './routes/technologyRoutes.js';
import aiPageRoutes from './routes/aiPageRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import knowledgePartnerRoutes from './routes/knowledgePartnerRoutes.js';
import comparisonRoutes from './routes/comparisonRoutes.js';
import counterRoutes from './routes/counterRoutes.js';
import stepByStepRoutes from './routes/stepByStepRoutes.js';
import animatedTextRoutes from './routes/animatedTextRoutes.js';
import imageComparisonRoutes from './routes/imageComparisonRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import whyGudMedRoutes from './routes/WhyGudMedisUniqueRoutes.js';
import mongoose from 'mongoose';

export const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mongodb: isConnected ? 'connected' : 'disconnected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Route middleware
app.use('/api/pages', pageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/technology', technologyRoutes);
app.use('/api/ai-pages', aiPageRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/knowledge-partners', knowledgePartnerRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/counter', counterRoutes);
app.use('/api/step-by-step', stepByStepRoutes);
app.use('/api/animated-text', animatedTextRoutes);
app.use('/api/image-comparison', imageComparisonRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/why-gudmed', whyGudMedRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'GudMed API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health'
    }
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO with HTTP server
const server = initSocket(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;