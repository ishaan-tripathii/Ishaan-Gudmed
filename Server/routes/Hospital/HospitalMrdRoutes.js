import express from 'express';
import {
    getDigitalHospital,
    createDigitalHospital,
    updateDigitalHospital,
    deleteDigitalHospital
}  from '../../controllers/Hospital/HospitalMrdControllers.js'

const router = express.Router();

router.get("/", getDigitalHospital);
router.post("/", createDigitalHospital);
router.put("/:id", updateDigitalHospital);
router.delete("/:id", deleteDigitalHospital);

export default router;