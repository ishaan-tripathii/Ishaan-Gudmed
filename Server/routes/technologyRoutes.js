import express from "express";
import {
  getTechnologyPages,
  createTechnologyPage,
  updateTechnologyPage,
  deleteTechnologyPage,
} from "../controllers/technologyController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public route: Get all pages or by slug/id
router.get("/", getTechnologyPages);

// Public route: Get a single page by ID
router.get("/:id", getTechnologyPages);

// Protected routes (require authentication)
router.post("/", authMiddleware, createTechnologyPage);
router.put("/:id", authMiddleware, updateTechnologyPage);
router.delete("/:id", authMiddleware, deleteTechnologyPage);

export default router;