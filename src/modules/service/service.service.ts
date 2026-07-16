import { prisma } from "../../lib/prisma";
import { IServiceFilterRequest } from "./service.interface";

const getAllServicesFromDB = async (filters: IServiceFilterRequest) => {
  const { searchTerm, categoryId, location, minPrice, maxPrice, rating } =
    filters;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }

  if (categoryId) {
    andConditions.push({
      categoryId,
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        gte: minPrice ? parseFloat(minPrice) : undefined,
        lte: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    });
  }

  if (location) {
    andConditions.push({
      technicianProfile: {
        user: {
          address: {
            contains: location,
            mode: "insensitive",
          },
        },
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const services = await prisma.service.findMany({
    where: whereConditions,
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: true,
          bookings: {
            include: {
              review: true,
            },
          },
        },
      },
    },
  });

  let result = services.map((service) => {
    const bookingsWithReviews = service.technicianProfile.bookings.filter(
      (b) => b.review !== null,
    );

    const totalRating = bookingsWithReviews.reduce(
      (sum, b) => sum + (b.review?.rating || 0),
      0,
    );

    const avgRating =
      bookingsWithReviews.length > 0
        ? totalRating / bookingsWithReviews.length
        : 0;

    return {
      ...service,
      averageRating: avgRating,
    };
  });

  if (rating) {
    const targetRating = parseFloat(rating);
    result = result.filter((service) => service.averageRating >= targetRating);
  }

  return result;
};

export const serviceService = {
  getAllServicesFromDB,
};
