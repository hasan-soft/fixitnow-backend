import express, { Router } from "express";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create/:id",
  auth("CUSTOMER"),
  paymentController.createCheckoutSession,
);

router.post(
  "/confirm",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

router.get("/", auth("CUSTOMER", "ADMIN"), paymentController.getAllPayments);

router.get(
  "/:id",
  auth("CUSTOMER", "ADMIN"),
  paymentController.getSinglePayment,
);

export const paymentRoutes = router;
