import { Router } from "express";
import { reviewController } from "./reviews.controller.js";
import { auth } from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";


const router = Router();


router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

router.get("", reviewController.getAllReviews);

router.delete("/:id", auth(Role.ADMIN, Role.CUSTOMER), reviewController.deleteReview);


export const reviewRoutes = router;
