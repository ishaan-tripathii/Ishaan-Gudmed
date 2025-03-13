import express from "express";
import {
  getAIPages,
  createAIPage,
  updateAIPage,
  deleteAIPage,
} from "../controllers/aiPageController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAIPages); // Get all AI pages
router.get("/:id", getAIPages); // Get a single AI page by ID

// Protected routes (Require authentication)
router.post("/", authMiddleware, createAIPage);
router.put("/:id", authMiddleware, updateAIPage);
router.delete("/:id", authMiddleware, deleteAIPage);

export default router;
