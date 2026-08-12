import express from "express";
import { technicianController } from "./technician.controller.js";
import { auth } from "../../middlewares/auth.js";

const router = express.Router();

// Public
router.get("/", technicianController.getAllTechnicians);


router.get("/profile", auth("TECHNICIAN"), technicianController.getMyProfile);

router.get("/bookings", auth("TECHNICIAN"), technicianController.getMyBookings);

router.patch(
 
  "/profile",
  auth("TECHNICIAN"),
  technicianController.updateProfile,
);

router.put(
  
  "/profile",
  auth("TECHNICIAN"),
  technicianController.updateProfile,
);

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


router.get("/:id", technicianController.getSingleTechnician);

export const technicianRoutes = router;
