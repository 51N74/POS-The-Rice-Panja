// src/app/api/rooms/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ แก้ไข 1: เปลี่ยน export const config เป็น export const runtime และบังคับใช้ dynamic
// เพื่อป้องกัน Build Error และ Connection Timeout
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 💡 หมายเหตุ: ใน App Router, params จะถูกส่งมาในอาร์กิวเมนต์ที่สอง
export async function GET(request, { params }) {
  // Destructure id จาก params
  const { id } = params;

  try {
    // ตรวจสอบว่า id มีค่าและเป็นตัวเลข
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid or missing Room ID parameter" },
        { status: 400 },
      );
    }

    // แปลง id เป็น Number สำหรับ Prisma where condition
    const roomId = Number(id);

    const roomOrders = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        // ดึงเฉพาะ Orders ที่ยังไม่ถูกจ่าย (ถ้ามีสถานะ 'pending' หรือ 'open')
        orders: {
          where: { status: { not: "Paid" } }, // 💡 ดึงเฉพาะออเดอร์ที่ยังไม่ปิดบิล
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
                    name: true,
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

    // กรองหาเฉพาะ Orders ที่ยังไม่ 'Paid' หากไม่ได้ใช้เงื่อนไข where ด้านบน
    const activeOrders = roomOrders.orders;

    // Summarize the total of all active orders
    const totalAmount = activeOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    // Send summarized data to the frontend
    return NextResponse.json({
      roomId: roomId,
      roomName: roomOrders.name, // เพิ่มชื่อ Room
      totalAmount: totalAmount.toFixed(2), // จัดรูปแบบเป็นทศนิยม 2 ตำแหน่ง
      orders: activeOrders,
    });
  } catch (error) {
    console.error("Error fetching room and orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch room and orders" },
      { status: 500 },
    );
  }
}
