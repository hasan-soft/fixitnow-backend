import { Router } from "express";
import { reviewController } from "./reviews.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();


router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

router.get("", reviewController.getAllReviews);

router.delete("/:id", auth(Role.ADMIN, Role.CUSTOMER), reviewController.deleteReview);


export const reviewRoutes = router;
