// src/app/api/order/[id]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: body.status },
    });

    // Step 2: Update table status to "Available"
    await prisma.table.update({
      where: { id: tableId },
      data: { status: "Available" },
    });

    // Step 2: Update table status to "Available"
    await prisma.room.update({
        where: { id: roomId },
        data: { status: "Available" },
      });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
