import { prisma } from "../../lib/prisma";
import {
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

  
  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: payload.status,
    },
  });

  return result;
};

export const technicianService = {
  updateProfileIntoDB,
  updateAvailabilityIntoDB,
  getMyBookingsFromDB,
  updateBookingStatusInDB,
};
