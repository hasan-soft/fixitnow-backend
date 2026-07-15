import { Router } from "express";
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
  paymentController.handleWebhook,
);

export const paymentRoutes = router;
