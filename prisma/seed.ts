import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean the database first
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

  // Create Menu Categories
  const categories = await Promise.all([
    prisma.menuCategory.create({
      data: { name: 'Main Dishes' },
    }),
    prisma.menuCategory.create({
      data: { name: 'Appetizers' },
    }),
    prisma.menuCategory.create({
      data: { name: 'Desserts' },
    }),
    prisma.menuCategory.create({
      data: { name: 'Beverages' },
    }),
  ]);

  // Create Menu Items
  const menuItems = await Promise.all([
    // Main Dishes
    prisma.menuItem.create({
      data: {
        name: 'Pad Thai',
        description: 'Classic Thai stir-fried rice noodles with tofu, shrimp, and peanuts',
        price: new Prisma.Decimal(12.99),
        categories: {
          create: [
            {
              menuCategory: {
                connect: { id: categories[0].id }, // Main Dishes
              },
            },
          ],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Green Curry',
        description: 'Spicy Thai green curry with coconut milk and vegetables',
        price: new Prisma.Decimal(14.99),
        categories: {
          create: [
            {
              menuCategory: {
                connect: { id: categories[0].id }, // Main Dishes
              },
            },
          ],
        },
      },
    }),
    // Appetizers
    prisma.menuItem.create({
      data: {
        name: 'Spring Rolls',
        description: 'Fresh vegetables wrapped in rice paper',
        price: new Prisma.Decimal(6.99),
        categories: {
          create: [
            {
              menuCategory: {
                connect: { id: categories[1].id }, // Appetizers
              },
            },
          ],
        },
      },
    }),
    // Desserts
    prisma.menuItem.create({
      data: {
        name: 'Mango Sticky Rice',
        description: 'Sweet sticky rice with fresh mango',
        price: new Prisma.Decimal(7.99),
        categories: {
          create: [
            {
              menuCategory: {
                connect: { id: categories[2].id }, // Desserts
              },
            },
          ],
        },
      },
    }),
    // Beverages
    prisma.menuItem.create({
      data: {
        name: 'Thai Iced Tea',
        description: 'Traditional Thai tea with milk',
        price: new Prisma.Decimal(3.99),
        categories: {
          create: [
            {
              menuCategory: {
                connect: { id: categories[3].id }, // Beverages
              },
            },
          ],
        },
      },
    }),
  ]);

  // Create Tables
  const tables = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.table.create({
        data: {
          tableNumber: i + 1,
          status: 'Available',
        },
      })
    )
  );

  // Create Rooms
  const rooms = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.room.create({
        data: {
          roomNumber: i + 1,
          status: 'Available',
        },
      })
    )
  );

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@thericepanja.com',
      // Note: In production, you should hash the password
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'secret123' hashed
      name: 'Admin User',
      role: 'admin',
    },
  });

  // Create Sample Staff User
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@thericepanja.com',
      // Note: In production, you should hash the password
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'secret123' hashed
      name: 'Staff User',
      role: 'staff',
    },
  });

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      status: 'Completed',
      total: new Prisma.Decimal(27.97),
      tableId: tables[0].id,
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
          amount: new Prisma.Decimal(27.97),
          method: 'Credit Card',
        },
      },
    },
  });

  console.log({
    categories,
    menuItems,
    tables,
    rooms,
    adminUser,
    staffUser,
    order,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
