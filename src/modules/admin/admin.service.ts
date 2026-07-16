import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";
import httpStatus from "http-status";

const getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatusInDB = async (id: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    const error = new Error("User not found!");
    (error as any).statusCode = httpStatus.NOT_FOUND;
    throw error;
  }


  if (user.role === "ADMIN") {
    const error = new Error("You cannot ban an admin user!");
    (error as any).statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const result = await prisma.user.update({
    where: { id },
    data: { status },
  });

  return result;
};


const getAllBookingsFromDB = async () => {
  return await prisma.booking.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      technicianProfile: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      service: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


const createCategoryInDB = async (payload: {
  name: string;
  description?: string;
}) => {
  const result = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description || "",
    },
  });
  return result;
};

const getAllCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllBookingsFromDB,
  createCategoryInDB,
  getAllCategoriesFromDB,
};
