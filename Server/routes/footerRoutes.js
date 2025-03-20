import express from "express";
import { getFooter, updateFooter, deleteFooter } from "../controllers/footerController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getFooter);
router.put("/", authenticateToken, updateFooter);
router.delete("/", authenticateToken, deleteFooter);

export default router;
