import express from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/", technicianController.getAllTechnicians);
router.get("/bookings", auth("TECHNICIAN"), technicianController.getMyBookings);
router.get("/:id", technicianController.getSingleTechnician);

router.put("/profile", auth("TECHNICIAN"), technicianController.updateProfile);

router.put(
  "/availability",
  auth("TECHNICIAN"),
  technicianController.updateAvailability,
);

router.patch(
  "/bookings/:id",
  auth("TECHNICIAN"),
  technicianController.updateBookingStatus,
);


export const technicianRoutes = router;
