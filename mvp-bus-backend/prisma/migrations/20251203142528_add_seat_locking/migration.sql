-- AlterTable
ALTER TABLE "TripSeat" ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedByUserId" INTEGER;
