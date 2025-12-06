/*
  Warnings:

  - Added the required column `tripId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrival` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Bus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "tripId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "arrival" TEXT NOT NULL,
ADD COLUMN     "departure" TEXT NOT NULL,
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
