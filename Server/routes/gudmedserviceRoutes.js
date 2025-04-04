import express from "express";
import { 
    getgudmedServices, 
    creategudmedServices, 
    updategudmedServices, 
    deletegudmedServices 
} from "../controllers/gudmedserviceControllers.js";

const router = express.Router();

router.get("/", getgudmedServices);
router.post("/", creategudmedServices);
router.put("/:id", updategudmedServices);
router.delete("/:id", deletegudmedServices);

export default router;


