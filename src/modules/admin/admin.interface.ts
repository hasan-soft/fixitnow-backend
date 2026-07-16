import { UserStatus } from "../../../generated/prisma/enums";

export type TUpdateUserStatusInput = {
  status: UserStatus;
};

export type TCreateCategoryInput = {
  name: string;
  description?: string;
};
