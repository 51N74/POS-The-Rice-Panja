// pages/api/tables.js

import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client"; ❌ ลบบรรทัดนี้
// const prisma = new PrismaClient(); ❌ ลบบรรทัดนี้

import prisma from "@/lib/prisma"; // ✅ ใช้ Prisma Singleton ที่ถูกจัดการแล้ว

// 💡 การแก้ไขที่สำคัญ: บังคับใช้ Node.js Runtime เพื่อความเสถียรในการเชื่อมต่อ DB
// เนื่องจากนี่คือ Pages Router API Route (pages/api)
// การตั้งค่า runtime อาจมีผลน้อยกว่า App Router แต่ยังคงแนะนำให้ทำ
export const config = {
  runtime: "nodejs",
};

export async function GET(request, { params }) {
  // ⚠️ หมายเหตุ: Pages Router API Routes จะได้รับ 'query' (รวมถึง id) จาก req.query
  // แต่โค้ดนี้ดูเหมือนจะถูกเขียนตามรูปแบบ App Router (ใช้ { params })
  // หากโค้ดนี้อยู่ใน pages/api/tables/[id].js และคุณใช้ Next.js 13/14
  // และมีการเรียกใช้ API นี้จาก Page Component ที่กำลังทำ SSG, ปัญหาก็จะเกิด

  // สมมติว่านี่คือ Pages Router API Route และ params ถูกดึงมาจาก query หรือมีการตั้งค่าพิเศษ
  // แต่เนื่องจากโค้ดเดิมใช้ { params } เราจะรักษารูปแบบไว้และแก้ไขเฉพาะปัญหา Build
  const { id } = params;

  // **หากคุณใช้ Pages Router จริงๆ (pages/api):** // คุณควรจะดึง id จาก: const { id } = request.query;

  try {
    // ตรวจสอบว่า id ไม่ใช่ undefined ก่อนที่จะเรียก parseInt
    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 },
      );
    }

    const roomOrders = await prisma.room.findUnique({
      where: { id: parseInt(id) },
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                menuItem: {
                  select: {
                    name: true, // Selecting the menu item name
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!roomOrders) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Summarize the total of all orders
    const totalAmount = roomOrders.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    console.log("Total amount:", totalAmount);

    // Send summarized data to the frontend
    return NextResponse.json({
      roomId: id,
      totalAmount,
      orders: roomOrders.orders,
    });
  } catch (error) {
    console.error("Error fetching table and orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch table and orders" },
      { status: 500 },
    );
  }
}
