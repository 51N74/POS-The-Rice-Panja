// pages/api/tables.js

import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client"; ❌ ลบบรรทัดนี้
// const prisma = new PrismaClient(); ❌ ลบบรรทัดนี้

import prisma from "@/lib/prisma"; // ✅ ใช้ Prisma Singleton ที่ถูกจัดการแล้ว

// 💡 การแก้ไขที่สำคัญ: บังคับใช้ Node.js Runtime เพื่อความเสถียรในการเชื่อมต่อ DB
// สำหรับ Pages Router API Route (pages/api) จะใช้ 'config'
export const config = {
  runtime: "nodejs",
};

export async function GET(request, { params }) {
  // ⚠️ หมายเหตุ: การดึง id ใน Pages Router API Route มักใช้ request.query
  // แต่เราจะใช้ { params } ตามรูปแบบโค้ดเดิมของคุณ และแก้ไขเฉพาะปัญหา Build
  const { id } = params;

  try {
    // ตรวจสอบว่า id ไม่ใช่ undefined ก่อนที่จะเรียก parseInt
    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 },
      );
    }

    const tableOrders = await prisma.table.findUnique({
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

    // Summarize the total of all orders
    const totalAmount = tableOrders.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    console.log("Total amount:", totalAmount);

    // Send summarized data to the frontend
    return NextResponse.json({
      tableId: id,
      totalAmount,
      orders: tableOrders.orders,
    });
  } catch (error) {
    console.error("Error fetching table and orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch table and orders" },
      { status: 500 },
    );
  }
}
