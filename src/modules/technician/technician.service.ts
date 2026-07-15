import { prisma } from "../../lib/prisma";
import {
  TTechnicianProfileUpdateInput,
  TUpdateAvailabilityInput,
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

export const technicianService = {
  updateProfileIntoDB,
  updateAvailabilityIntoDB,
  getMyBookingsFromDB,
};
