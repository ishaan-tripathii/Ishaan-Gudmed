import express from "express";
import { getImageComparison, updateImageComparison } from "../controllers/imageComparisonController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getImageComparison);
router.put("/", authenticateToken, updateImageComparison);

export default router;