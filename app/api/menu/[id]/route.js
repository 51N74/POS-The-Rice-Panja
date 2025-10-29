import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET
export async function GET(request, { params }) {
  try {
    const menuID = Number(params.id);

    if (isNaN(menuID)) {
      return NextResponse.json(
        { error: "Invalid menu item ID." },
        { status: 400 },
      );
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: menuID,
      },
      include: {
        // images: true, // หากต้องการดึงข้อมูลรูปภาพ
        categories: {
          include: {
            menuCategory: true,
          },
        },
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    // 👈 เพิ่ม Error Handling ที่สมบูรณ์
    console.error("Error fetching menu item:", error);
    // เมื่อมี error เกิดขึ้น จะ return status 500 แทนการปล่อยให้ build ล้มเหลว
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
      { status: 500 },
    );
  }
}

// PATCH
export async function PATCH(request, { params }) {
  const { id } = params;

  // ใช้ try...catch ครอบการอ่าน body ด้วย เพื่อป้องกัน error
  try {
    const { name, description, price, menuCategory } = await request.json();

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        menuCategory,
      },
      // ... include options
    });
    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 },
    );
  }
}

// DELETE
export async function DELETE(request, { params }) {
  try {
    const menuID = Number(params.id);

    // Check if the menuID is valid
    if (isNaN(menuID)) {
      return NextResponse.json(
        { message: "Invalid menu item ID." },
        { status: 400 },
      );
    }

    const deleteMenu = await prisma.menuItem.delete({
      where: {
        id: menuID,
      },
    });

    return NextResponse.json({ message: "Delete Successful" }, { status: 200 });
  } catch (error) {
    // กรณีที่ delete ล้มเหลว (เช่น ไม่พบ ID นั้น)
    console.error("Error deleting menu item:", error);

    return NextResponse.json(
      { message: "Failed to delete item.", error: error.message },
      { status: 500 },
    );
  }
}
