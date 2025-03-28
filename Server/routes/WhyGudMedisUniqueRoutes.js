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
router.get("/", getWhyGudMedPages);          // GET /api/why-gudmed
router.get("/:id", getWhyGudMedPages);       // GET /api/why-gudmed/:id

// Protected routes
router.post("/", authMiddleware, createWhyGudMedPage);    // POST /api/why-gudmed
router.put("/:id", authMiddleware, updateWhyGudMedPage);  // PUT /api/why-gudmed/:id
router.delete("/:id", authMiddleware, deleteWhyGudMedPage); // DELETE /api/why-gudmed/:id

export default router;