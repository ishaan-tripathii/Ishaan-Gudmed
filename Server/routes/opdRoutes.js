import express from "express";
import {
  getOPD,
  createOPD,
  updateOPD,
  deleteOPD,
} from "../controllers/opdControllers.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", getOPD);
router.post("/", authMiddleware, createOPD);
router.put("/:id", authMiddleware, updateOPD);
router.delete("/:id", authMiddleware, deleteOPD);

export default router;