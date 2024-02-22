/*
  Warnings:

  - A unique constraint covering the columns `[teamIdHome,teamIdAway,date]` on the table `Match` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Match_teamIdHome_teamIdAway_date_key" ON "Match"("teamIdHome", "teamIdAway", "date");
