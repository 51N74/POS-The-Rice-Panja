// pages/api/tables.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
    try {
      return Response.json(await prisma.table.findMany(
        {
          orderBy: {
            id: 'asc'
          }
        }
      ))  
    } catch (error) {
          console.error('Error creating category:', error);
          res.status(500).json({ message: 'Error creating category' });
        }
  }
