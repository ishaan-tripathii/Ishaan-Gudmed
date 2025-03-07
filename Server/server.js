import 'dotenv/config'; // Load environment variables first
import express from 'express';
import cors from 'cors'; // Import CORS middleware
import connectDB from './config/db.js';
import { initSocket } from './services/socket.js';
import pageRoutes from './routes/pages.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import technologyRoutes from "./routes/technologyRoutes.js"

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