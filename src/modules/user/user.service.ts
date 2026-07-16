import { prisma } from "../../lib/prisma";
import { TUpdateProfileInput } from "./user.interface";

const updateMyProfileInDB = async (
  userId: string,
  payload: TUpdateProfileInput,
) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phoneNumber: true,
      address: true,
      createdAt: true,
    },
  });

  return result;
};

export const UserService = {
  updateMyProfileInDB,
};
