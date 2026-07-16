import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";

const createCategoryIntoDB = async (payload: ICategory) => {
  return await prisma.category.create({
    data: payload,
  });
};

const getAllCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    include: {
      services: true,
    },
  });
};

const getSingleCategoryFromDB = async (id: string) => {
  return await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });
};


export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
};
