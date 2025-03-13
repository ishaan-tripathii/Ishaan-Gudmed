// clientRoutes.js
import express from "express";
import { getClientSettings, updateClientSettings } from "../controllers/clientController.js";
import  authenticateToken  from "../middleware/auth.js"; // Assuming you have auth middleware

const router = express.Router();

router.get("/", getClientSettings);
router.put("/", authenticateToken, updateClientSettings);

export default router;