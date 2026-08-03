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

// Update Category
const updateCategoryInDB = async (id: string, payload: { name?: string; description?: string }) => {
  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return result;
};

// Delete Category
const deleteCategoryFromDB = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};


export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB, 
  deleteCategoryFromDB,
};
