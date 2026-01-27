/*
  Warnings:

  - You are about to drop the column `cancelReason` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Bus` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `price` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `seats` on the `Bus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "cancelReason",
DROP COLUMN "paymentStatus",
DROP COLUMN "status",
DROP COLUMN "totalAmount",
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Bus" DROP COLUMN "createdAt",
ADD COLUMN     "bookedSeats" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "seats",
ADD COLUMN     "seats" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
