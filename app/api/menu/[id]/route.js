import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
    try {
      const { id } = params;
      const body = await request.json();
  
      // Start a transaction to update the menu item and manage images
      const updatedMenuItem = await prisma.$transaction(async (prisma) => {
        // Delete existing images associated with the menu item
        await prisma.menuItemImage.deleteMany({
          where: { menuItemId: Number(id) },
        });
  
        // Update the menu item details
        const updatedItem = await prisma.menuItem.update({
          where: { id: Number(id) },
          data: {
            name: body.name,
            description: body.description,
            price: parseFloat(body.price),
            category: body.category,
            images: {
              create: body.images.map((imageUrl) => ({
                url: imageUrl,
              })),
            },
          },
          include: {
            images: true, // Include the images in the response
          },
        });
  
        return updatedItem;
      });
  
      return NextResponse.json(updatedMenuItem);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }
  }
  
  
  
export async function DELETE(request, { params }) {
    try {
      const menuID = Number(params.id);
      const deleteComment = await prisma.menuItem.delete({
        where: {
          id: menuID,
        },
      });
  
      return Response.json({ message: "Delete Success ful" });
    } catch (error) {
      return Response.json(error);
    }
  }
