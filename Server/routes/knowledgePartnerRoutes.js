// backend/routes/knowledgePartnerRoutes.js
import express from "express";
import { getKnowledgePartners, updateKnowledgePartners } from "../controllers/knowledgePartnerController.js";
import  authenticateToken  from "../middleware/auth.js"; // Assuming you have this middleware

const router = express.Router();

// GET: Fetch knowledge partners and accreditations
router.get("/", getKnowledgePartners);

// PUT: Update knowledge partners and accreditations (admin only)
router.put("/", authenticateToken, updateKnowledgePartners);

export default router;