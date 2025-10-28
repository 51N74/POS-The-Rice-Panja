// lib/prisma.js หรือ utils/prisma.js

import { PrismaClient } from "@prisma/client";

// กำหนดให้ตัวแปรที่เก็บ PrismaClient เป็นแบบ Global เพื่อให้ Next.js/Prisma
// ใช้ Instance เดิมเมื่ออยู่ใน Development
const globalForPrisma = globalThis;

/**
 * @type {PrismaClient}
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // ไม่จำเป็นต้องใส่ log: ['query'] หากไม่ต้องการ debug
    // log: ['query', 'error', 'warn'],
  });

// ใน Production, เราไม่ต้องการให้ Instance ถูกเก็บไว้ใน globalForPrisma
// เพราะมันจะถูกทำลายเมื่อ Serverless Function เสร็จสิ้น
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
