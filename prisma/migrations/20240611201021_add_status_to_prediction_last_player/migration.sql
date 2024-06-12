/*
  Warnings:

  - Added the required column `status` to the `PredictionLastPlayer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PredictionLastPlayerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "PredictionLastPlayer" ADD COLUMN     "status" "PredictionLastPlayerStatus" NOT NULL;
