/*
  Warnings:

  - You are about to rename the column `clientId` on the `Post` table to `clientProfileId`. Data will be preserved.

*/
-- DropForeignKey (Safe check)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Post_clientId_fkey') THEN
        ALTER TABLE "Post" DROP CONSTRAINT "Post_clientId_fkey";
    END IF;
END $$;

-- AlterTable (Safe Add Columns)
ALTER TABLE "ClientProfile"
ADD COLUMN IF NOT EXISTS "linkedinPostsPerDay" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS "styleSample" TEXT,
ADD COLUMN IF NOT EXISTS "threadsPostsPerDay" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS "twitterPostsPerDay" INTEGER NOT NULL DEFAULT 1;

-- AlterTable (Safe Rename)
DO $$
BEGIN
    -- Rename only if old exists and new does not
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Post' AND column_name = 'clientId') AND
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Post' AND column_name = 'clientProfileId') THEN
        ALTER TABLE "Post" RENAME COLUMN "clientId" TO "clientProfileId";
    END IF;
END $$;

-- AlterTable (Safe Add Columns)
ALTER TABLE "Preferences"
ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "tone" TEXT;

-- AlterTable (Safe Add Columns)
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "clientProfileId" TEXT;

-- AddForeignKey (Safe Add Constraints)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Topic_clientProfileId_fkey') THEN
        ALTER TABLE "Topic" ADD CONSTRAINT "Topic_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Post_clientProfileId_fkey') THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
