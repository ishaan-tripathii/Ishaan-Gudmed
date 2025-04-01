import express from "express";
import { getClientSettings, updateClientSettings } from "../controllers/clientController.js";
import authenticateToken from "../middleware/auth.js"; // Assuming auth middleware exists

const router = express.Router();

router.get("/", getClientSettings);
router.put("/", authenticateToken, updateClientSettings);

export default router;