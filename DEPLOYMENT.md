# Campus Gigs - Deployment Guide

## Overview
This guide explains how to deploy Campus Gigs to the cloud with a PostgreSQL database.

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- SQLite (automatically used for local development)

### Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Set up local database:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Cloud Deployment (PostgreSQL)

### Step 1: Choose a Cloud Provider
Recommended options:
- **Vercel** (recommended for Next.js) - Free tier available
- **Railway** - Free tier available
- **Supabase** - PostgreSQL hosting
- **Neon** - PostgreSQL hosting
- **PlanetScale** - MySQL alternative

### Step 2: Create PostgreSQL Database
1. Sign up on your chosen provider
2. Create a new PostgreSQL database
3. Copy the connection string (DATABASE_URL)

### Step 3: Update Prisma Schema
In `prisma/schema.prisma`, change the datasource:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 4: Set Environment Variables
1. Go to your deployment platform's settings
2. Add these environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your production domain (https://yourdomain.com)
   - `ADMIN_REGISTRATION_CODE`: "110238870" (or your custom code)

### Step 5: Run Migrations
Before deploying, run:
```bash
npm run db:push
```

### Step 6: Deploy
#### Using Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

#### Using Docker
```bash
# Build
npm run build

# Start
npm start
```

#### Using Traditional Server
1. Build the project: `npm run build`
2. Ensure Node.js 18+ is installed
3. Set all environment variables
4. Run: `npm start`

## Database Considerations for Cloud

### Connection Pooling
For cloud deployment with many concurrent connections, consider using connection pooling:
- Vercel Postgres includes pooling
- For other providers, use Prisma Data Proxy or PgBouncer

### Migrations
CloudSQL and other hosted databases may require:
```bash
npx prisma migrate deploy
```

### Backup Strategy
1. Enable automated backups on your provider
2. Test restoration regularly
3. Keep local backups of critical data

## Monitoring & Maintenance

### Health Checks
- Monitor database connection health
- Set up alerts for deployment failures
- Monitor API response times

### Scaling
- Start with single database instance
- Scale vertically (larger instance) as needed
- Consider read replicas for heavy read workloads

## Troubleshooting

### "relation does not exist" errors
- Ensure migrations have run: `npm run db:push`
- Check DATABASE_URL is correct

### Connection timeouts
- Check database credentials
- Verify firewall/network rules allow connections
- Check connection pooling configuration

### Performance issues
- Add database indexes as needed
- Monitor slow queries
- Consider query optimization

## Switching Between Environments

### Local to Cloud
1. Change `datasource.provider` in `prisma/schema.prisma`
2. Update `.env` with cloud DATABASE_URL
3. Run `npm run db:push`
4. Rebuild Prisma client: `npm run db:generate`

### Cloud to Local (Testing)
1. Create local SQLite copy
2. Export data from cloud database
3. Import to local database for testing

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] NEXTAUTH_SECRET is strong and secure
- [ ] Database backups enabled
- [ ] SSL/HTTPS configured
- [ ] CORS settings configured
- [ ] Rate limiting configured
- [ ] Error monitoring set up (e.g., Sentry)
- [ ] Performance monitoring set up
- [ ] Admin account created

## API Security

### Rate Limiting
Consider implementing rate limiting for API endpoints:
- Use middleware or service like Cloudflare
- Limit requests per IP/user
- Protect signup and authentication routes

### Data Validation
- All inputs validated with Zod schemas (already implemented)
- SQL injection protection via Prisma ORM
- CSRF protection via NextAuth

## Support

For issues or questions:
1. Check Prisma documentation: https://www.prisma.io/docs/
2. Check Next.js documentation: https://nextjs.org/docs
3. Check NextAuth.js documentation: https://next-auth.js.org/

---

**Last Updated**: March 9, 2026  
**Version**: 0.1.0
