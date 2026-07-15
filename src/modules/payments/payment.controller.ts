import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    const result = await paymentService.createCheckoutSessionIntoDB(
      userId as string,
      bookingId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Stripe signature is missing in headers",
        data: null,
      });
    }

    await paymentService.handleWebhook(event, signature);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment processed successfully via webhook",
      data: null,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
};
