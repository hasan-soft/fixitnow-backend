import express from "express";
import { auth } from "../../middlewares/auth";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/", auth("CUSTOMER"), bookingController.createBooking);

export const bookingRoutes = router;
