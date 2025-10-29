// src/app/api/menu/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fetch from "node-fetch"; // Needed to use fetch on the server

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        categories: {
          include: {
            menuCategory: true, // ดึงข้อมูลชื่อหมวดหมู่จาก MenuCategory
          },
        },
        images: true,
      },
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.formData();

    const name = body.get("name");
    const description = body.get("description");
    const price = parseFloat(body.get("price"));
    const imageFiles = body.getAll("images"); // Collect all image files
    const categoryName = body.get("categoryName"); // Updated to match 'categoryName'

    // Log to inspect received values
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Price:", price);
    console.log("ImageFiles:", imageFiles);
    console.log("Category Name:", categoryName);

    // Validation
    if (
      !name ||
      !description ||
      isNaN(price) ||
      imageFiles.length === 0 ||
      !categoryName
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    // Process images into binary data
    const imageDataArray = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = await file.arrayBuffer();
        return Buffer.from(buffer); // Convert to binary
      }),
    );

    // Log image data array to inspect if buffers are processed
    console.log("Image Data Array:", imageDataArray);

    // Find or create category without upsert
    let category = await prisma.menuCategory.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      category = await prisma.menuCategory.create({
        data: { name: categoryName },
      });
    }

    // Create the MenuItem with a relationship to the category through MenuItemCategory
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        images: {
          create: imageDataArray.map((imageData) => ({ imageData })),
        },
        categories: {
          create: { menuCategoryId: category.id },
        },
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error); // Detailed error log
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 },
    );
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
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await prisma.menuItem.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 },
    );
  }
}
