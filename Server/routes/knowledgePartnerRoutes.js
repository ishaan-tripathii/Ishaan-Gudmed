import express from "express";
import { 
  getKnowledgePartners, 
  createKnowledgePartners, 
  updateKnowledgePartners, 
  deleteKnowledgePartners 
} from "../controllers/knowledgePartnerController.js";
import authenticateToken from "../middleware/auth.js"; 

const router = express.Router();

router.get("/", getKnowledgePartners); 
router.post("/", authenticateToken, createKnowledgePartners); 
router.put("/:id", authenticateToken, updateKnowledgePartners); 
router.delete("/:id", authenticateToken, deleteKnowledgePartners); 

export default router;