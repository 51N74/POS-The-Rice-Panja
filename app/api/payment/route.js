// src/app/api/payment/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, amount, method } = body;

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        method,
        order: { connect: { id: parseInt(orderId) } },
      },
    });

    // Update order status to 'paid'
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: 'paid' },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}