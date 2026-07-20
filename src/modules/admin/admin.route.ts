import express from "express";
import { adminController } from "./admin.controller.js";
import { auth } from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = express.Router();

router.post("/categories", auth(Role.ADMIN), adminController.createCategory);
router.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);

export const adminRoutes = router;





