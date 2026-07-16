import { prisma } from "../../lib/prisma";
import { IReview } from "./reviews.interface";
import httpStatus from "http-status";

const createReviewIntoDB = async (userId: string, payload: IReview) => {
  const { bookingId, rating, comment } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.customerId !== userId) {
    const error = new Error("You are not authorized to review this booking!");
    (error as any).statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }

  if (booking.status !== "COMPLETED") {
    const error = new Error(
      "You can only leave a review after the job is completed!",
    );
    (error as any).statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) {
    const error = new Error("You have already reviewed this booking!");
    (error as any).statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const result = await prisma.review.create({
    data: {
      rating,
      comment,
      bookingId,
      customerId: userId,
    },
    include: {
      customer: true,
      booking: {
        include: {
          technicianProfile: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });

  return result;
};

const getAllReviewsFromDB = async () => {
  return await prisma.review.findMany({
    include: {
      customer: true,
      booking: {
        include: {
          technicianProfile: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });
};

const deleteReviewFromDB = async (id: string) => {
  return await prisma.review.delete({
    where: {
      id,
    },
  });
};

export const reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  deleteReviewFromDB,
};
