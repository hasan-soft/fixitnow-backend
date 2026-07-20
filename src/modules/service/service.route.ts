import { Router } from "express";
import { serviceController } from "./service.controller.js";

const router = Router();

router.get("/", serviceController.getAllServices);

export const serviceRoutes = router;
