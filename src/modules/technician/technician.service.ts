import { prisma } from "../../lib/prisma";
import {
    ITechnicianFilterRequest,
  TTechnicianProfileUpdateInput,
  TUpdateAvailabilityInput,
  TUpdateBookingStatusInput,
} from "./technician.interface";

const updateProfileIntoDB = async (
  userId: string,
  payload: TTechnicianProfileUpdateInput,
) => {
  const isProfileExist = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (isProfileExist) {
    return await prisma.technicianProfile.update({
      where: { userId },
      data: payload,
    });
  }

  return await prisma.technicianProfile.create({
    data: {
      userId,
      skills: payload.skills || [],
      experience: payload.experience || 0,
      pricing: payload.pricing || 0.0,
      bio: payload.bio,
      availabilitySlots: [],
    },
  });
};

const updateAvailabilityIntoDB = async (
  userId: string,
  payload: TUpdateAvailabilityInput,
) => {
  return await prisma.technicianProfile.update({
    where: { userId },
    data: {
      availabilitySlots: payload.availabilitySlots,
    },
  });
};

const getMyBookingsFromDB = async (userId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found!");
  }

  const result = await prisma.booking.findMany({
    where: {
      technicianProfileId: technicianProfile.id,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      service: true,
    },
  });

  return result;
};


const updateBookingStatusInDB = async (
  userId: string,
  bookingId: string,
  payload: TUpdateBookingStatusInput,
) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found!");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found!");
  }

  if (booking.technicianProfileId !== technicianProfile.id) {
    throw new Error("You are not authorized to update this booking!");
  }

  if (payload.status === "ACCEPTED" || payload.status === "DECLINED") {
    if (booking.status !== "REQUESTED") {
      throw new Error("Only REQUESTED bookings can be accepted or declined!");
    }
  }

  if (payload.status === "IN_PROGRESS") {
    if (booking.status !== "PAID") {
      throw new Error("Can only start jobs that are already PAID!");
    }
  }

  if (payload.status === "COMPLETED") {
    if (booking.status !== "IN_PROGRESS") {
      throw new Error("Can only complete jobs that are currently IN_PROGRESS!");
    }
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: payload.status,
    },
  });

  return result;
};

const getAllTechniciansFromDB = async (filters: ITechnicianFilterRequest) => {
  const { searchTerm, categoryId, location, minPrice, maxPrice, rating } =
    filters;
  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      user: { name: { contains: searchTerm, mode: "insensitive" } },
    });
  }

  if (location) {
    andConditions.push({
      user: { address: { contains: location, mode: "insensitive" } },
    });
  }

  if (categoryId) {
    andConditions.push({ services: { some: { categoryId } } });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      pricing: {
        gte: minPrice ? parseFloat(minPrice) : undefined,
        lte: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const technicians = await prisma.technicianProfile.findMany({
    where: whereConditions,
    include: {
      user: true,
      services: { include: { category: true } },
      bookings: { include: { review: true } },
    },
  });

  let result = technicians.map((tech) => {
    const bookingsWithReviews = tech.bookings.filter((b) => b.review !== null);
    const totalRating = bookingsWithReviews.reduce(
      (sum, b) => sum + (b.review?.rating || 0),
      0,
    );
    const avgRating =
      bookingsWithReviews.length > 0
        ? totalRating / bookingsWithReviews.length
        : 0;
    return { ...tech, averageRating: avgRating };
  });

  if (rating) {
    result = result.filter((tech) => tech.averageRating >= parseFloat(rating));
  }

  return result;
};

const getSingleTechnicianFromDB = async (id: string) => {
  return await prisma.technicianProfile.findUniqueOrThrow({
    where: { id },
    include: {
      user: true,
      services: { include: { category: true } },
      bookings: {
        include: {
          review: {
            include: {
              customer: true,
            },
          },
        },
      },
    },
  });
};

export const technicianService = {
  updateProfileIntoDB,
  updateAvailabilityIntoDB,
  getMyBookingsFromDB,
  updateBookingStatusInDB,
  getAllTechniciansFromDB,
  getSingleTechnicianFromDB,
};
