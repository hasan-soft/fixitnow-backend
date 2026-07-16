import express from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.patch("/profile", auth(), UserController.updateMyProfile);

export const userRoutes = router;
