
import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;  
}

export interface LoginUserPayload {
  email: string;
  password: string;
}