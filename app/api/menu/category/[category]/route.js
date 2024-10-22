// // Example API endpoint for filtering menu items by category
// export default async function handler(req, res) {
//     const { category } = req.query;
  
//     try {
//       const menuItems = await prisma.menuItem.findMany({
//         where: {
//           category: category,
//         },
//         include: {
//           images: true, // Include related images
//         },
//       });
//       res.status(200).json(menuItems);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch menu items' });
//     }
//   }
  

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { category } = params; // Get the category from the route parameters

  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        category: decodeURIComponent(category), // Decode the category from the URL
      },
      include: {
        images: true, // Include related images
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}
