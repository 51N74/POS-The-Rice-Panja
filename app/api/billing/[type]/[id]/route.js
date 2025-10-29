// src/app/api/billing/[type]/[id]/route.js

import { NextResponse } from "next/server";
// ⚠️ แก้ไข: ใช้ Relative Path เพื่อแก้ปัญหา Module Not Found ถ้ายังไม่ได้ตั้งค่า Alias
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

// สำคัญ: ต้องเพิ่ม runtime และ dynamic เพื่อป้องกัน Build Error และ Connection Timeout
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
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

  // 1. กำหนดเงื่อนไขการค้นหา (Where Clause)
  let whereCondition = {};
  const locationName =
    type === "table" ? "Table" : type === "room" ? "Room" : null;

  if (!locationName) {
    return NextResponse.json(
      { error: "Invalid location type. Must be 'table' or 'room'." },
      { status: 400 },
    );
  }

  if (type === "table") {
    whereCondition = { tableId: locationId };
  } else if (type === "room") {
    whereCondition = { roomId: locationId };
  }

  try {
    // 2. ดึง Orders ทั้งหมดที่ยังไม่ชำระเงิน (สถานะ: ไม่ใช่ 'Paid')
    const orders = await prisma.order.findMany({
      where: {
        ...whereCondition,
        status: { not: "Paid" },
      },
      // 3. Include รายละเอียด OrderItems และ MenuItem (เพื่อแสดงในบิล)
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (orders.length === 0) {
      return NextResponse.json({
        location: `${locationName} ${locationId}`,
        totalAmount: "0.00",
        orders: [],
      });
    }

    // 4. คำนวณยอดรวมทั้งหมด (Total Bill)
    // ใช้ reduce เพื่อรวมค่า total ของทุก Order
    const totalAmount = orders.reduce((sum, order) => {
      // ⚠️ เนื่องจาก order.total เป็น Prisma.Decimal ต้องใช้ .plus()
      return sum.plus(order.total);
    }, new Prisma.Decimal(0));

    // 5. ส่งข้อมูลบิลที่ครบถ้วนกลับไป
    return NextResponse.json({
      location: `${locationName} ${locationId}`,
      // แปลง Decimal เป็น string เพื่อส่งผ่าน JSON และจัดรูปแบบทศนิยม
      totalAmount: totalAmount.toFixed(2),
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching bill details:", error);
    return NextResponse.json(
      { error: "Failed to retrieve bill details from database." },
      { status: 500 },
    );
  }
}
