/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Booking` table. All the data in the column will be lost.
  - The `seats` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentId",
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "totalAmount" DOUBLE PRECISION,
DROP COLUMN "seats",
ADD COLUMN     "seats" TEXT[];
