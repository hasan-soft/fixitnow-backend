import { Router } from "express";
import { reviewController } from "./reviews.controller";
import { auth } from "../../middlewares/auth";


const router = Router();


router.post("/", auth("CUSTOMER"), reviewController.createReview);

router.get("", reviewController.getAllReviews);

router.delete("/:id", auth("ADMIN", "CUSTOMER"), reviewController.deleteReview);


export const reviewRoutes = router;
