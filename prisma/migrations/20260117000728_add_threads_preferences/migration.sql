-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "threadsConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "threadsPostsPerDay" INTEGER NOT NULL DEFAULT 1;
