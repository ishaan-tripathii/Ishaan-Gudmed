import express from "express";
import { getImageComparison, updateImageComparison } from "../controllers/imageComparisonController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", getImageComparison);
router.put("/", authMiddleware, updateImageComparison);

export default router;