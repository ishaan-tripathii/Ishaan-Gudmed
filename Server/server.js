import 'dotenv/config'; // Add this at the top to load .env variables
import express from 'express';
import cors from 'cors';
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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    initSocket(server);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;