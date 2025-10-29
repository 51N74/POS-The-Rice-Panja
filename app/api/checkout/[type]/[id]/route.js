// src/app/api/checkout/[type]/[id]/route.js (โค้ดที่ปรับปรุงแล้ว)

import { NextResponse } from "next/server";
// ⚠️ แก้ไข: ใช้ Relative Path เพื่อแก้ปัญหา Module Not Found
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  // 💡 ดึง type ('table' หรือ 'room') และ id จาก params
  const { type, id } = params;

  if (!type || !id) {
    return NextResponse.json(
      { error: "Location type (table/room) and ID are required" },
      { status: 400 },
    );
  }

  // 💡 แปลง ID เป็นตัวเลข เพื่อใช้กับ where clause
  const locationId = Number(id);
  if (isNaN(locationId)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  // 🔑 การใช้ Prisma Transaction เพื่อรับประกันว่าการอัปเดตสถานะ Orders และ Table/Room
  //    จะต้องสำเร็จทั้งหมด (All or Nothing)
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. อัปเดตสถานะของ Orders ทั้งหมดที่เกี่ยวข้องให้เป็น "Paid"
      const orderUpdateResult = await tx.order.updateMany({
        where: {
          // 💡 ใช้เงื่อนไขตาม type
          [type === "table" ? "tableId" : "roomId"]: locationId,
          status: { not: "Paid" }, // อัปเดตเฉพาะรายการที่ยังไม่จ่าย
        },
        data: { status: "Paid" },
      });

      let locationUpdateResult;

      // 2. อัปเดตสถานะของ Table หรือ Room ให้เป็น "Available"
      if (type === "table") {
        locationUpdateResult = await tx.table.update({
          where: { id: locationId },
          data: { status: "Available" },
        });
      } else if (type === "room") {
        locationUpdateResult = await tx.room.update({
          where: { id: locationId },
          data: { status: "Available" },
        });
      } else {
        // ถ้า type ไม่ใช่ 'table' หรือ 'room' ให้ยกเลิก Transaction
        throw new Error("Invalid location type specified.");
      }

      return {
        orderCount: orderUpdateResult.count,
        location: locationUpdateResult,
      };
    });

    // 3. ส่งผลลัพธ์ที่สำเร็จกลับไป
    const locationName = type === "table" ? "Table" : "Room";

    return NextResponse.json({
      message: `Checkout successful for ${locationName} ${id}. ${result.orderCount} orders paid.`,
      location: result.location,
    });
  } catch (error) {
    console.error("Checkout Transaction Failed:", error);

    // ⚠️ ข้อความนี้จะแสดงเมื่อ Transaction ล้มเหลวเนื่องจาก Error ใดๆ (เช่น Invalid Type หรือ DB Error)
    return NextResponse.json(
      { error: "Failed to finalize checkout process.", details: error.message },
      { status: 500 },
    );
  }
}
