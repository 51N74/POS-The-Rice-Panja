// src/app/api/room/route.js

import { NextResponse } from "next/server"; // ✅ Import NextResponse
import prisma from "@/app/lib/prisma";

// 💡 การแก้ไขที่สำคัญ: บังคับใช้ Node.js Runtime เพื่อความเสถียรในการเชื่อมต่อ DB
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        id: "asc",
      },
    });

    // ✅ ใช้ NextResponse.json() แทน Response.json()
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);

    // ✅ ใช้ NextResponse.json() สำหรับการตอบกลับแบบ Error
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch rooms",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
