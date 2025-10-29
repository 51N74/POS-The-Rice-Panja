// src/app/api/tables/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// 💡 การแก้ไขที่สำคัญ: ต้องกำหนด runtime และ dynamic เพื่อป้องกัน Timeout (500 Error)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  // Destructure id จาก params (App Router)
  const { id } = params;

  try {
    // 1. ✅ ตรวจสอบและแปลง id
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid or missing Table ID parameter" },
        { status: 400 },
      );
    }

    const tableId = Number(id);

    const tableOrders = await prisma.table.findUnique({
      where: { id: tableId },
      include: {
        orders: {
          // 2. ✅ เพิ่มการกรอง: ดึงเฉพาะ Orders ที่ยังไม่ถูกจ่าย (status ไม่ใช่ 'Paid')
          where: { status: { not: "Paid" } },
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

    if (!tableOrders) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // กรองหาเฉพาะ Orders ที่ยังไม่ 'Paid'
    const activeOrders = tableOrders.orders;

    // 3. ✅ Summarize the total of all *active* orders
    const totalAmount = activeOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    // Send summarized data to the frontend
    return NextResponse.json({
      tableId: id,
      tableStatus: tableOrders.status, // เพิ่มสถานะโต๊ะปัจจุบัน
      totalAmount: totalAmount.toFixed(2), // จัดรูปแบบเป็นทศนิยม 2 ตำแหน่ง
      orders: activeOrders,
    });
  } catch (error) {
    console.error("Error fetching table and orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch table and orders" },
      { status: 500 },
    );
  }
}
