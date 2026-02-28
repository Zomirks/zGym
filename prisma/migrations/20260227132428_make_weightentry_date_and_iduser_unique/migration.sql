/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `WeightEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WeightEntry_userId_date_idx";

-- AlterTable
ALTER TABLE "WeightEntry" ALTER COLUMN "date" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "WeightEntry_userId_date_key" ON "WeightEntry"("userId", "date");
