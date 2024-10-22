// src/app/api/order/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { menuItem: true } } },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error); // Log for debugging
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body || typeof body.total === 'undefined' || !Array.isArray(body.items) || !body.tableId) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { total, items, tableId } = body;

    // Create the order
    const order = await prisma.order.create({
      data: {
        status: 'pending',
        total,
        items: {
          create: items.map(item => ({
            quantity: item.quantity,
            menuItem: { connect: { id: item.menuItemId } },
          })),
        },
        table: { connect: { id: tableId } }, // Link the order to the table
      },
      include: { items: { include: { menuItem: true } } },
    });

    // Step 2: Update the table status to "Occupied"
    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'Occupied' },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error); // Log to inspect errors
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PUT and DELETE methods can be added as needed
