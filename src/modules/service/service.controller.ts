import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";
import httpStatus from "http-status";

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const result = await serviceService.getAllServicesFromDB(filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

export const serviceController = {
  getAllServices,
};
