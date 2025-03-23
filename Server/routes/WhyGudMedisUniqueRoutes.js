import express from "express";
import {
  getWhyGudMedPages,
  createWhyGudMedPage,
  updateWhyGudMedPage,
  deleteWhyGudMedPage,
  getUniquePoints,
  createUniquePoint,
  updateUniquePoint,
  deleteUniquePoint
} from "../controllers/WhyGudMedIsUniqueController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes for main pages
router.get("/", getWhyGudMedPages);          // Handles GET /api/why-gudmed
router.get("/:id", getWhyGudMedPages);       // Handles GET /api/why-gudmed/:id

// Protected routes for main pages
router.post("/", authMiddleware, createWhyGudMedPage);    // Handles POST /api/why-gudmed
router.put("/:id", authMiddleware, updateWhyGudMedPage);  // Handles PUT /api/why-gudmed/:id
router.delete("/:id", authMiddleware, deleteWhyGudMedPage); // Handles DELETE /api/why-gudmed/:id

// Routes for unique points
router.get("/unique-points", getUniquePoints);           // Handles GET /api/why-gudmed/unique-points
router.post("/unique-points", authMiddleware, createUniquePoint);    // Handles POST /api/why-gudmed/unique-points
router.put("/unique-points/:id", authMiddleware, updateUniquePoint); // Handles PUT /api/why-gudmed/unique-points/:id
router.delete("/unique-points/:id", authMiddleware, deleteUniquePoint); // Handles DELETE /api/why-gudmed/unique-points/:id

export default router;