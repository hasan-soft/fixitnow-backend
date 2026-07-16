import express from "express";
import { categoryController } from "../category/category.controller";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/categories", auth(Role.ADMIN), categoryController.createCategory);
router.get(
  "/categories",
  auth(Role.ADMIN),
  categoryController.getAllCategories,
);

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);

export const adminRoutes = router;
