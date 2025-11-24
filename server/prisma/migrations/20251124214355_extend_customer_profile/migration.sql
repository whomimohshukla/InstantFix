-- AlterTable
ALTER TABLE "CustomerProfile" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "defaultAddressId" TEXT,
ADD COLUMN     "preferences" JSONB;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_defaultAddressId_fkey" FOREIGN KEY ("defaultAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
