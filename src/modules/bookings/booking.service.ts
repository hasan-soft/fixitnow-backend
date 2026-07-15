import { prisma } from "../../lib/prisma";
import { TCreateBookingInput } from "./booking.interface";

const createBookingIntoDB = async (
  userId: string,
  payload: TCreateBookingInput,
) => {
 
  const customer = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!customer || customer.role !== "CUSTOMER") {
    throw new Error("Only active customers can create a booking!");
  }


  const technician = await prisma.technicianProfile.findUnique({
    where: { id: payload.technicianProfileId },
  });

  if (!technician) {
    throw new Error("Requested technician profile not found!");
  }

  const service = await prisma.service.findUnique({
    where: { id: payload.serviceId },
  });

  if (!service) {
    throw new Error("Requested service not found!");
  }

  const result = await prisma.booking.create({
    data: {
      customerId: customer.id,
      technicianProfileId: payload.technicianProfileId,
      serviceId: payload.serviceId,
      bookingDate: new Date(payload.bookingDate),
      timeSlot: payload.timeSlot,
      status: "REQUESTED",
    },
    include: {
      technicianProfile: true,
      service: true,
    },
  });

  return result;
};

export const bookingService = {
  createBookingIntoDB,
};
