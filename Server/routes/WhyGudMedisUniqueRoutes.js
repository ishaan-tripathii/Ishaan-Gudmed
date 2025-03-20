import express from "express";
import {
  getWhyGudMedPages,
  createWhyGudMedPage,
  updateWhyGudMedPage,
  deleteWhyGudMedPage,
} from "../controllers/WhyGudMedIsUniqueController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getWhyGudMedPages);          // Handles GET /api/why-gudmed
router.get("/:id", getWhyGudMedPages);       // Handles GET /api/why-gudmed/:id

// Protected routes with middleware
router.post("/", authMiddleware, createWhyGudMedPage);    // Handles POST /api/why-gudmed
router.put("/:id", authMiddleware, updateWhyGudMedPage);  // Handles PUT /api/why-gudmed/:id
router.delete("/:id", authMiddleware, deleteWhyGudMedPage); // Handles DELETE /api/why-gudmed/:id

export default router;