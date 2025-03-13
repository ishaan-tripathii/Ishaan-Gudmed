import express from "express";
import { getAnimatedText, updateAnimatedText } from "../controllers/animatedTextController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAnimatedText);
router.put("/", authenticateToken, updateAnimatedText);

export default router;