import { Router } from "express";
import { serviceController } from "./service.controller.js";

const router = Router();

router.get("/", serviceController.getAllServices);
router.post("/", serviceController.createService);
router.get("/:id", serviceController.getSingleService);

export const serviceRoutes = router;
