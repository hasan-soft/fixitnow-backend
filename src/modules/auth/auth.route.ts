
import express from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();


router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

router.get("/me", auth(), AuthController.getMe);

export const authRoutes = router;
