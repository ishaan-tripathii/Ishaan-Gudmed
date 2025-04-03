import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import { initSocket, notifyClients } from "./services/socket.js";
import pageRoutes from "./routes/pages.js";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import technologyRoutes from "./routes/technologyRoutes.js";
import aiPageRoutes from "./routes/aiPageRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import knowledgePartnerRoutes from "./routes/knowledgePartnerRoutes.js";
import comparisonRoutes from "./routes/comparisonRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";
import stepByStepRoutes from "./routes/stepByStepRoutes.js";
import animatedTextRoutes from "./routes/animatedTextRoutes.js";
import imageComparisonRoutes from "./routes/imageComparisonRoutes.js";
import footerRoutes from "./routes/footerRoutes.js";
import whyGudMedRoutes from "./routes/WhyGudMedisUniqueRoutes.js";
import mongoose from "mongoose";
import AboutUs from "./routes/Aboutus/aboutusRoute.js";
import ourachievements from "./routes/Aboutus/ouracievmentsRoutes.js";
import ThirdSection from "./routes/Aboutus/thirsectionRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

export const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://gudmed-frontend.onrender.com",
    "https://gudmed-admin.onrender.com",
    "https://gudmed-backend.onrender.com",
    "https://www.gudmed.in",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

app.get("/api/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      mongodb: isConnected ? "connected" : "disconnected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/pages", pageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
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
app.use("/api/why-gudmed", whyGudMedRoutes);
app.use("/api/aboutus",AboutUs);
app.use("/api/ourachievements", ourachievements);
app.use("/api/thirdsection", ThirdSection);
app.use("/api/patients", patientRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "GudMed API is running",
    version: "1.0.0",
    endpoints: { health: "/api/health" },
  });
});

const httpServer = createServer(app);
const io = initSocket(httpServer); // Initialize Socket.IO once

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;