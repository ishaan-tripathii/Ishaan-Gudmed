import express from 'express';
import {
    getDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor
} from "../controllers/doctorController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", getDoctor);
router.post("/", authenticateToken, createDoctor);
router.put("/:id", authenticateToken, updateDoctor);
router.delete("/:id", authenticateToken, deleteDoctor);

export default router;
