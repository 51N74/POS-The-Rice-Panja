import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

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
      images: item.images.map((image) => {
        // 💡 โค้ดที่ถูกแก้ไข: ใช้ ArrayBuffer / TextDecoder ที่รองรับ Edge Runtime

        // 1. รับข้อมูล Buffer/Uint8Array
        const bufferData = image.imageData;

        // 2. แปลง Buffer/Uint8Array เป็น String ที่เหมาะสมสำหรับ btoa
        let binary = "";
        const bytes = new Uint8Array(bufferData);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        // 3. ใช้ btoa (รองรับ Edge) ในการแปลงเป็น Base64
        const base64Image = btoa(binary);

        return {
          ...image,
          // 4. ใช้ Base64 String ที่แปลงแล้ว
          url: `data:image/jpeg;base64,${base64Image}`,
        };
      }),
    }));

    return NextResponse.json(formattedMenuItems);
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 },
    );
  }
}
