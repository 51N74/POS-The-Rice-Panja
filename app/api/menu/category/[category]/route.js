import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { category } = params;

  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        categories: {
          some: {
            menuCategory: {
              name: decodeURIComponent(category), // Match category name
            },
          },
        },
      },
      include: {
        images: true,
        categories: {
          include: {
            menuCategory: true,
          },
        },
      },
    });

    // Convert imageData to Base64 format
    const formattedMenuItems = menuItems.map((item) => ({
      ...item,
      images: item.images.map((image) => ({
        ...image,
        url: `data:image/jpeg;base64,${Buffer.from(image.imageData).toString("base64")}`, // Convert to Base64
      })),
    }));

    return NextResponse.json(formattedMenuItems);
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

