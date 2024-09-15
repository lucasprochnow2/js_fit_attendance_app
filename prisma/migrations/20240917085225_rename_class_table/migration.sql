/*
  Warnings:

  - You are about to drop the `class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "class";

-- CreateTable
CREATE TABLE IF NOT EXISTS "classroom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("id")
);
