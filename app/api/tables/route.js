// ในไฟล์ Route Handler ของคุณ (เช่น /app/api/tables/route.js หรือ /app/api/table/route.js)

// import { PrismaClient } from '@prisma/client' ❌ ลบบรรทัดนี้
// const prisma = new PrismaClient() ❌ ลบบรรทัดนี้

import prisma from "@/lib/prisma"; // ✅ ใช้ Prisma Singleton ที่ถูกจัดการแล้ว

// 💡 การแก้ไขที่สำคัญ: บังคับใช้ Node.js Runtime เพื่อความเสถียรในการเชื่อมต่อ DB
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // ใช้ Response.json() ที่ถูกต้องสำหรับ App Router
    const tables = await prisma.table.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return Response.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);

    // ⚠️ การแก้ไข: ต้องใช้ Response object ที่ถูกต้องสำหรับ App Router
    return new Response(JSON.stringify({ message: "Error fetching tables" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
