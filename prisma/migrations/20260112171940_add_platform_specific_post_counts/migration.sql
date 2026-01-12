-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "linkedinPostsPerDay" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "twitterPostsPerDay" INTEGER NOT NULL DEFAULT 1;
