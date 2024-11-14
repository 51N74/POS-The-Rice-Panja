/*
  Warnings:

  - You are about to drop the column `url` on the `MenuItemImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuItemImage" DROP COLUMN "url",
ADD COLUMN     "imageData" BYTEA;
