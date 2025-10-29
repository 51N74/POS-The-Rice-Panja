import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Clean the database first (ลบข้อมูลทั้งหมด)
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItemCategory.deleteMany({});
  await prisma.menuItemImage.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. 🔑 รีเซ็ต ID Counter (Sequence) เพื่อให้ ID เริ่มต้นที่ 1 เสมอ
  //    สิ่งนี้สำคัญในการแก้ปัญหา Unique Constraint และทำให้ ID = tableNumber/roomNumber/userID
  //    ใช้ CASCADE เพื่อลบข้อมูลในตารางที่เชื่อมโยงอยู่ด้วย
  try {
    await prisma.$executeRaw(
      Prisma.sql`TRUNCATE TABLE "Table" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$executeRaw(
      Prisma.sql`TRUNCATE TABLE "Room" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$executeRaw(
      Prisma.sql`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$executeRaw(
      Prisma.sql`TRUNCATE TABLE "MenuCategory" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$executeRaw(
      Prisma.sql`TRUNCATE TABLE "MenuItem" RESTART IDENTITY CASCADE;`,
    );
    console.log("Database sequence counters reset successfully.");
  } catch (e) {
    console.warn(
      "Could not execute TRUNCATE. This might be normal if the database is fresh, or if running on SQLite.",
    );
    // SQLite does not support TRUNCATE with RESTART IDENTITY
  }

  // 3. Create Tables
  const tables = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.table.create({
        data: {
          tableNumber: i + 1, // tableNumber จะตรงกับ ID คือ 1 ถึง 10
          status: "Available",
        },
      }),
    ),
  );
  console.log(`Created ${tables.length} tables.`);

  // 4. Create Rooms
  const rooms = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.room.create({
        data: {
          roomNumber: i + 1, // roomNumber จะตรงกับ ID คือ 1 ถึง 5
          status: "Available",
        },
      }),
    ),
  );
  console.log(`Created ${rooms.length} rooms.`);

  // 5. Create Menu Categories
  const categories = await Promise.all([
    prisma.menuCategory.create({
      data: { name: "Main Dishes" },
    }),
    prisma.menuCategory.create({
      data: { name: "Appetizers" },
    }),
    prisma.menuCategory.create({
      data: { name: "Desserts" },
    }),
    prisma.menuCategory.create({
      data: { name: "Beverages" },
    }),
  ]);
  console.log(`Created ${categories.length} menu categories.`);

  // 6. Create Menu Items
  const menuItems = await Promise.all([
    // Main Dishes (index 0)
    prisma.menuItem.create({
      data: {
        name: "Pad Thai",
        description:
          "Classic Thai stir-fried rice noodles with tofu, shrimp, and peanuts",
        price: new Prisma.Decimal(12.99),
        categories: {
          create: [{ menuCategory: { connect: { id: categories[0].id } } }],
        },
      },
    }),
    // Main Dishes (index 1)
    prisma.menuItem.create({
      data: {
        name: "Green Curry",
        description: "Spicy Thai green curry with coconut milk and vegetables",
        price: new Prisma.Decimal(14.99),
        categories: {
          create: [{ menuCategory: { connect: { id: categories[0].id } } }],
        },
      },
    }),
    // Appetizers (index 2)
    prisma.menuItem.create({
      data: {
        name: "Spring Rolls",
        description: "Fresh vegetables wrapped in rice paper",
        price: new Prisma.Decimal(6.99),
        categories: {
          create: [{ menuCategory: { connect: { id: categories[1].id } } }],
        },
      },
    }),
    // Desserts (index 3)
    prisma.menuItem.create({
      data: {
        name: "Mango Sticky Rice",
        description: "Sweet sticky rice with fresh mango",
        price: new Prisma.Decimal(7.99),
        categories: {
          create: [{ menuCategory: { connect: { id: categories[2].id } } }],
        },
      },
    }),
    // Beverages (index 4)
    prisma.menuItem.create({
      data: {
        name: "Thai Iced Tea",
        description: "Traditional Thai tea with milk",
        price: new Prisma.Decimal(3.99),
        categories: {
          create: [{ menuCategory: { connect: { id: categories[3].id } } }],
        },
      },
    }),
  ]);
  console.log(`Created ${menuItems.length} menu items.`);

  // 7. Create Users
  // รหัสผ่าน: 'secret123' (ถูก Hash แล้ว)
  const hashedPassword =
    "$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm";

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@thericepanja.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: "staff@thericepanja.com",
      password: hashedPassword,
      name: "Staff User",
      role: "staff",
    },
  });
  console.log(`Created 2 users.`);

  // 8. Create a sample order (สำหรับ Table 1)
  const sampleOrderTotal = new Prisma.Decimal(12.99).plus(
    new Prisma.Decimal(3.99).times(2),
  ); // Pad Thai (1) + Thai Iced Tea (2)

  const order = await prisma.order.create({
    data: {
      status: "Completed",
      total: sampleOrderTotal,
      tableId: tables[0].id, // อ้างอิงถึง Table 1
      items: {
        create: [
          {
            quantity: 1,
            menuItemId: menuItems[0].id, // Pad Thai
          },
          {
            quantity: 2,
            menuItemId: menuItems[4].id, // Thai Iced Tea
          },
        ],
      },
      payment: {
        create: {
          amount: sampleOrderTotal,
          method: "Credit Card",
        },
      },
    },
  });
  console.log(`Created 1 sample order.`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
