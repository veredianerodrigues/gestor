-- CreateEnum
CREATE TYPE "ContentVisibility" AS ENUM ('PUBLIC', 'RESTRICTED');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN "visibility" "ContentVisibility" NOT NULL DEFAULT 'PUBLIC';

-- CreateIndex
CREATE INDEX "Content_visibility_idx" ON "Content"("visibility");

-- CreateIndex
CREATE INDEX "Content_type_status_visibility_idx" ON "Content"("type", "status", "visibility");
