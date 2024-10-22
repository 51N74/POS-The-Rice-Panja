-- CreateTable
CREATE TABLE "MenuItemImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,

    CONSTRAINT "MenuItemImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuItemImage" ADD CONSTRAINT "MenuItemImage_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
