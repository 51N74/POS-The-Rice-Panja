// src/app/api/order/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
        room: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate the request body
    if (
      !body ||
      typeof body.total === "undefined" ||
      !Array.isArray(body.items) ||
      (!body.tableId && !body.roomId)
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { total, items, tableId, roomId } = body;

    // Prepare the order data conditionally
    const orderData = {
      status: "pending",
      total,
      items: {
        create: items.map((item) => ({
          quantity: item.quantity,
          menuItem: { connect: { id: item.menuItemId } },
        })),
      },
    };

    if (tableId) {
      orderData.table = { connect: { id: tableId } };
    }

    if (roomId) {
      orderData.room = { connect: { id: roomId } };
    }

    // Create the order
    const order = await prisma.order.create({
      data: orderData,
      include: { items: { include: { menuItem: true } } },
    });

    // Update table status if tableId is provided
    if (tableId) {
      await prisma.table.update({
        where: { id: tableId },
        data: { status: "Occupied" },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error); // Log to inspect errors
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

// PUT and DELETE methods can be added as needed
