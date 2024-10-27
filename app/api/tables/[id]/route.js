// pages/api/tables.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  try {
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

    if (!tableOrders) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Summarize the total of all orders
    // Summarize the total of all orders
    const totalAmount = tableOrders.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
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
      { status: 500 }
    );
  }
}
