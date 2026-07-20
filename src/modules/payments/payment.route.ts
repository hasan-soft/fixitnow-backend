import express, { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { paymentController } from "./payment.controller.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

router.post(
  "/confirm",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

router.get(
  "/",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getAllPayments,
);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getSinglePayment,
);

export const paymentRoutes = router;
