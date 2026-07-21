import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { bookingId } = req.body;

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
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      let bodyData = req.body;
      if (Buffer.isBuffer(req.body)) {
        try {
          bodyData = JSON.parse(req.body.toString("utf-8"));
        } catch (error) {
          bodyData = {};
        }
      }

      const bookingId = bodyData?.bookingId;

      const result = await paymentService.handleManualPaymentConfirm(bookingId);

      return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment confirmed successfully",
        data: result,
      });
    }

    const event = req.body as Buffer;
    await paymentService.handleWebhook(event, signature);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment processed successfully via webhook",
      data: null,
    });
  },
);

const getAllPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await paymentService.getAllPaymentsFromDB(
      userId as string,
      role as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    const paymentId = req.params.id as string;

    const result = await paymentService.getSinglePaymentFromDB(
      paymentId,
      userId as string,
      role as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getAllPayments,
  getSinglePayment,
};
