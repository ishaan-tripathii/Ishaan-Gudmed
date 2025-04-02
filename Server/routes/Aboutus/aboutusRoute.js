import express from "express";
import { getAboutUs, createAboutUs, updateAboutUs, deleteAboutUs } from "../../controllers/aboutusControllers.js";
import authenticateToken from "../../middleware/auth.js";

const router = express.Router();

// Public route (no authentication required)
router.get("/", getAboutUs);

// Protected routes (require authentication)
router.post("/", authenticateToken, createAboutUs);
router.put("/:id", authenticateToken, updateAboutUs); // Changed to /:id
router.delete("/:id", authenticateToken, deleteAboutUs); // Changed to /:id

export default router;