// src/app/api/menu/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function GET() {
    try {
      const menuItems = await prisma.menuItem.findMany({
        include: {
          images: true, // รวมข้อมูล images
        },
      });
      return NextResponse.json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error); // เพิ่มการ log ข้อผิดพลาดเพื่อช่วยในการดีบัก
      return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
    }
  }

  export async function POST(request) {
    const body = await request.json();
    try {
      const menuItem = await prisma.menuItem.create({
        data: {
          name: body.name,
          description: body.description,
          price: parseFloat(body.price),
          category: body.category,
          images: {
            create: body.images.map((imageUrl) => ({
              url: imageUrl, // ใช้ URL จาก body.images
            })),
          },
        },
      });
      return NextResponse.json(menuItem, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
    }
  }

export async function PUT(request) {
  try {
    const body = await request.json();
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(body.id) },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        category: body.category,
        images: {
          create: body.images.map((imageUrl) => ({
            url: imageUrl, // ใช้ URL จาก body.images
          })),
        },
      },
    });
    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.menuItem.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}