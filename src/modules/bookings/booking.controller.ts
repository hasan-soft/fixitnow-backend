import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id; 
  const payload = req.body;

  const result = await bookingService.createBookingIntoDB(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking requested successfully!",
    data: result,
  });
});

export const bookingController = {
  createBooking,
};
