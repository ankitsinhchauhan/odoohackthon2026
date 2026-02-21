import express from "express";
import { addVehicle, getVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", addVehicle);
router.get("/", getVehicles);

export default router;
