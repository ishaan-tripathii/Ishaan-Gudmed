import 'dotenv/config'; // Load environment variables first
import express from 'express';
import cors from 'cors'; // Import CORS middleware
import connectDB from './config/db.js';
import { initSocket } from './services/socket.js';
import pageRoutes from './routes/pages.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import technologyRoutes from "./routes/technologyRoutes.js"
import  aiPageRoutes from "./routes/aiPageRoutes.js"
import clientRoutes from "./routes/clientRoutes.js";
import knowledgePartnerRoutes from "./routes/knowledgePartnerRoutes.js"
import comparisonRoutes from "./routes/comparisonRoutes.js"
import counterRoutes from "./routes/counterRoutes.js"
import stepByStepRoutes from "./routes/stepByStepRoutes.js";
import animatedTextRoutes from "./routes/animatedTextRoutes.js"
import imageComparisonRoutes from "./routes/imageComparisonRoutes.js"
import footerRoutes from "./routes/footerRoutes.js"


// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow these origins
  credentials: true, // Allow cookies (needed for your token cookie)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json());

// Mount routes
app.use('/api/pages', pageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/technology", technologyRoutes);
app.use("/api/ai-pages", aiPageRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/knowledge-partners", knowledgePartnerRoutes);
app.use("/api/comparison", comparisonRoutes);
app.use("/api/counter", counterRoutes);
app.use("/api/step-by-step", stepByStepRoutes);
app.use("/api/animated-text", animatedTextRoutes);
app.use("/api/image-comparison", imageComparisonRoutes);
app.use("/api/footer", footerRoutes);


// Define port
const PORT = process.env.PORT || 5000;

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // Initialize Socket.io
    initSocket(server);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Execute server startup
startServer();

// Export app for testing (optional)
export default app;