// backend/routes/comparisonRoutes.js
import express from "express";
import { getComparison, updateComparison,deleteComparisonItem } from "../controllers/comparisonController.js";
import authenticateToken  from "../middleware/auth.js"; // Assuming you have this

const router = express.Router();

router.get("/", getComparison);
router.put("/", authenticateToken, updateComparison);
router.delete("/item", authenticateToken, deleteComparisonItem);
export default router;