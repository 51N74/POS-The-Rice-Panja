// ในไฟล์ Route Handler ของคุณ (เช่น /app/api/room/route.js)

// import { PrismaClient } from '@prisma/client' ❌ ลบบรรทัดนี้
// const prisma = new PrismaClient() ❌ ลบบรรทัดนี้

import prisma from "@/lib/prisma"; // ✅ ใช้ Prisma Singleton ที่ถูกจัดการแล้ว

// 💡 การแก้ไขที่สำคัญ: บังคับใช้ Node.js Runtime เพื่อความเสถียรในการเชื่อมต่อ DB
export const runtime = "nodejs";

export async function GET() {
  try {
    // ใช้ Response.json() ที่ถูกต้องสำหรับ App Router
    const rooms = await prisma.room.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return Response.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);

    // ⚠️ การแก้ไข: ต้องใช้ NextResponse.json ใน App Router (Next.js 13/14)
    // และตัวแปร Response object ที่ใช้ใน App Router จะไม่มี .json/.status
    return new Response(JSON.stringify({ message: "Error fetching rooms" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
