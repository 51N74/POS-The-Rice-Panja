// src/app/api/order/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}
