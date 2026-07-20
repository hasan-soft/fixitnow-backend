import express from "express";
import { UserController } from "./user.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = express.Router();

router.patch("/profile", auth(), UserController.updateMyProfile);

export const userRoutes = router;
