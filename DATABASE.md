# Database Setup Guide for The Rice Panja

This guide explains how to set up and manage the database for The Rice Panja POS system using Vercel Postgres.

## Prerequisites

- Vercel account
- Node.js and npm installed
- Git repository connected to Vercel

## Setting Up Vercel Postgres

1. Go to your project dashboard on Vercel
2. Click on "Storage" in the sidebar
3. Select "Create New" → "Postgres Database"
4. Choose your region and create the database
5. After creation, Vercel will provide you with the following environment variables:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

## Local Development Setup

1. Create a `.env` file in your project root:
   ```env
   POSTGRES_PRISMA_URL="your-pooling-connection-url"
   POSTGRES_URL_NON_POOLING="your-direct-connection-url"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

## Database Schema

The database schema includes the following models:
- MenuItem
- MenuItemImage
- MenuCategory
- MenuItemCategory
- Order
- OrderItem
- Payment
- Table
- Room
- User

## Deployment

1. Push your changes to the connected Git repository

2. Vercel will automatically:
   - Generate Prisma Client
   - Run migrations
   - Build and deploy your application

3. After deployment, seed the production database:
   ```bash
   vercel env pull .env.production
   npm run seed
   ```

## Important Notes

1. The seed file includes:
   - Sample menu items and categories
   - Default admin user (admin@thericepanja.com)
   - Default staff user (staff@thericepanja.com)
   - Sample tables and rooms
   - Example order data

2. In production, make sure to:
   - Change default passwords
   - Update menu items with actual data
   - Configure proper security measures

## Troubleshooting

1. If migrations fail:
   ```bash
   npx prisma migrate reset
   ```

2. To view database:
   ```bash
   npx prisma studio
   ```

3. Common Issues:
   - Connection timeout: Check your firewall settings
   - Migration conflicts: Try resetting the database
   - Seeding errors: Ensure all required data is properly formatted

## Maintenance

1. Regular backups:
   - Vercel Postgres automatically handles backups
   - Additional manual backups recommended

2. Monitoring:
   - Use Vercel Dashboard for database metrics
   - Monitor connection pool usage
   - Watch for slow queries

3. Schema updates:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

## Security Best Practices

1. Never commit `.env` files
2. Use connection pooling for better performance
3. Implement proper access controls
4. Regularly update passwords
5. Monitor database access logs

## Support

For additional support:
1. Check Vercel documentation
2. Prisma documentation
3. Project GitHub issues
4. Contact the development team
