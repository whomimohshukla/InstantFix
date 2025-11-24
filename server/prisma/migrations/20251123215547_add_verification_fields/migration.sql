/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Refund` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_bookingId_fkey";

-- AlterTable
ALTER TABLE "Refund" DROP COLUMN "bookingId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3);
