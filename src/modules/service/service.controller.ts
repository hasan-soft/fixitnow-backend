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

const getSingleService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await serviceService.getSingleServiceFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service retrieved successfully",
      data: result,
    });
  },
);

// Create Service Controller
const createService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.createServiceToDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service created successfully",
      data: result,
    });
  },
);

export const serviceController = {
  getAllServices,
  getSingleService,
  createService,
};
