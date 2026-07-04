-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accountHandle" TEXT,
ADD COLUMN     "accountImage" TEXT,
ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "clientProfileId" TEXT;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
