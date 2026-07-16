import { prisma } from "../../lib/prisma";
import { TCreateBookingInput } from "./booking.interface";
import { Role } from "../../../generated/prisma/enums";

const createBookingIntoDB = async (
  userId: string,
  payload: TCreateBookingInput,
) => {
  const customer = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!customer || customer.role !== Role.CUSTOMER) {
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

  if (!technician.availabilitySlots.includes(payload.timeSlot)) {
    throw new Error("Selected time slot is not available for this technician!");
  }

  return await prisma.booking.create({
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
};

const getMyBookingsFromDB = async (customerId: string) => {
  return await prisma.booking.findMany({
    where: { customerId },
    include: { service: true, technicianProfile: { include: { user: true } } },
  });
};

const getBookingDetailsFromDB = async (
  customerId: string,
  bookingId: string,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { service: true, technicianProfile: { include: { user: true } } },
  });

  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to view this booking!");
  }
  return booking;
};

export const bookingService = {
  createBookingIntoDB,
  getMyBookingsFromDB,
  getBookingDetailsFromDB,
};
