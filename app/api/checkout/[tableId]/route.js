// src/app/api/checkout/[tableId]/route.js (หรือ .ts)

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
// ⚠️ สำคัญ: ต้องเพิ่ม runtime และ dynamic เพื่อป้องกัน Build Error และ Connection Timeout
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const { tableId } = params;

  if (!tableId) {
    return NextResponse.json(
      { error: "Table ID is required" },
      { status: 400 },
    );
  }

  try {
    // 1. อัปเดตสถานะของ Orders ทั้งหมดที่เกี่ยวข้องกับ Table นี้ให้เป็น "Paid" (หรือ "completed")
    const updatedOrders = await prisma.order.updateMany({
      where: {
        tableId: Number(tableId),
        status: { not: "Paid" }, // อัปเดตเฉพาะรายการที่ยังไม่จ่าย
      },
      data: { status: "Paid" },
    });

    // 2. อัปเดตสถานะของ Table ให้เป็น "Available"
    const updatedTable = await prisma.table.update({
      where: { id: Number(tableId) },
      data: { status: "Available" },
    });

    // 3. (ถ้ามี Room ให้เพิ่ม Logic อัปเดต Room Status ตรงนี้)

    return NextResponse.json({
      message: `Checkout successful for Table ${tableId}. ${updatedOrders.count} orders paid.`,
      table: updatedTable,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to finalize checkout process." },
      { status: 500 },
    );
  }
}
