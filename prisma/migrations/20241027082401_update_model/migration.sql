/*
  Warnings:

  - You are about to drop the `_MenuItemCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MenuItemCategories" DROP CONSTRAINT "_MenuItemCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuItemCategories" DROP CONSTRAINT "_MenuItemCategories_B_fkey";

-- DropTable
DROP TABLE "_MenuItemCategories";

-- CreateTable
CREATE TABLE "MenuItemCategory" (
    "id" SERIAL NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,

    CONSTRAINT "MenuItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemCategory_menuItemId_menuCategoryId_key" ON "MenuItemCategory"("menuItemId", "menuCategoryId");

-- AddForeignKey
ALTER TABLE "MenuItemCategory" ADD CONSTRAINT "MenuItemCategory_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemCategory" ADD CONSTRAINT "MenuItemCategory_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
