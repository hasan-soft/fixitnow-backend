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

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await bookingService.getMyBookingsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings fetched successfully",
    data: result,
  });
});

const getBookingDetails = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await bookingService.getBookingDetailsFromDB(
    userId,
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking details fetched successfully",
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const bookingId = req.params.id as string;

  const result = await bookingService.cancelBookingFromDB(userId, bookingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking cancelled successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
};
