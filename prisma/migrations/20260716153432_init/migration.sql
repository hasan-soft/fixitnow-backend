/*
  Warnings:

  - You are about to drop the column `availabilitySlots` on the `technician_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technician_profiles" DROP COLUMN "availabilitySlots";

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "technicianProfileId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_technicianProfileId_fkey" FOREIGN KEY ("technicianProfileId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
