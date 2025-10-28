// src/app/api/order/[id]/route.ts

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // ✅ ใช้ Prisma Singleton ที่ถูกจัดการแล้ว

// 💡 การแก้ไขที่สำคัญ: บังคับใช้ Node.js Runtime เพื่อความเสถียรในการเชื่อมต่อ DB
export const runtime = "nodejs";

//Get order
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: { include: { menuItem: true } } },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  // ⚠️ ข้อควรระวัง: ตรวจสอบว่า tableId และ roomId ถูกส่งมาใน body หรือถูกกำหนดที่ใด
  // เนื่องจากโค้ดเดิมไม่ได้ประกาศตัวแปรเหล่านี้
  const { status, tableId, roomId } = body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status }, // ใช้ status ที่ดึงมาจาก body
    });

    // Step 2: Update table status to "Available"
    if (tableId) {
      // เพิ่มการตรวจสอบตัวแปร
      await prisma.table.update({
        where: { id: tableId },
        data: { status: "Available" },
      });
    }

    // Step 3: Update room status to "Available"
    if (roomId) {
      // เพิ่มการตรวจสอบตัวแปร
      await prisma.room.update({
        where: { id: roomId },
        data: { status: "Available" },
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
