-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'DONE', 'CANCELED');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'WAITING';
