import express from "express";
import { auth } from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { bookingController } from "./booking.controller.js";

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
