import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { auth } from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();


router.post("/", auth(Role.ADMIN), categoryController.createCategory);


router.get("/", categoryController.getAllCategories);


router.get("/:id", categoryController.getSingleCategory);

export const categoryRoutes = router;
