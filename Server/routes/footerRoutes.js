import express from "express";
import { getFooter, updateFooter } from "../controllers/footerController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getFooter);
router.put("/", authenticateToken, updateFooter);

export default router;