import express from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/", auth(Role.CUSTOMER), bookingController.createBooking);
router.get("/", auth(Role.CUSTOMER), bookingController.getMyBookings);
router.get("/:id", auth(Role.CUSTOMER), bookingController.getBookingDetails);

router.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  bookingController.cancelBooking,
);

export const bookingRoutes = router;
