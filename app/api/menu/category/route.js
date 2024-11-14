import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//Get All Category
export async function GET() {
  try {
    const menuCategory = await prisma.menuCategory.findMany({    
    });

    return NextResponse.json(menuCategory);
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}
