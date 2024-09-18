/*
  Warnings:

  - You are about to drop the column `date` on the `presence` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,classroom_id]` on the table `presence` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "presence_user_id_classroom_id_date_idx";

-- DropIndex
DROP INDEX "presence_user_id_classroom_id_date_key";

-- AlterTable
ALTER TABLE "presence" DROP COLUMN "date";

-- CreateIndex
CREATE INDEX "presence_user_id_classroom_id_idx" ON "presence"("user_id", "classroom_id");

-- CreateIndex
CREATE UNIQUE INDEX "presence_user_id_classroom_id_key" ON "presence"("user_id", "classroom_id");
