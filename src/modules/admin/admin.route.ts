import express from "express";
import { categoryController } from "../category/category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/categories", auth(Role.ADMIN), categoryController.createCategory);

router.get(
  "/categories",
  auth(Role.ADMIN),
  categoryController.getAllCategories,
);

export const adminRoutes = router;
