// app/api/category/route.js

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

//Get All Category
export async function GET() {
  try {
    // การเรียกใช้ Prisma ยังคงเหมือนเดิม
    const menuCategory = await prisma.menuCategory.findMany({});

    return NextResponse.json(menuCategory);
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    // ✅ การจัดการ Error ที่ดีแล้ว
    return NextResponse.json(
      { error: "Failed to fetch menu categories" },
      { status: 500 },
    );
  }
}
