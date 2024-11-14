/*
  Warnings:

  - You are about to drop the column `category` on the `MenuItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuItemCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MenuItemCategories_AB_unique" ON "_MenuItemCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuItemCategories_B_index" ON "_MenuItemCategories"("B");

-- AddForeignKey
ALTER TABLE "_MenuItemCategories" ADD CONSTRAINT "_MenuItemCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "MenuCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemCategories" ADD CONSTRAINT "_MenuItemCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
