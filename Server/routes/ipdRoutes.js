import express from "express";
import { getImageComparison, updateImageComparison } from "../controllers/ipdController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getImageComparison);
router.put("/", authMiddleware, updateImageComparison);

export default router;