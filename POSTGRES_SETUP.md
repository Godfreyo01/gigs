# Fix Campus Gigs Signup Error - PostgreSQL Setup Guide (Render)

## Problem
The signup endpoint on Render fails with: **"An error occurred during signup. Please try again later."**

This happens because the application was using SQLite, which doesn't work on Render's serverless platform since file systems aren't persistent between requests.

## Solution
Switch to PostgreSQL and configure environment variables properly on Render.

---

## Step 1: Create a Free PostgreSQL Database

### Option A: Render Postgres (EASIEST - Same Platform)
1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **+ New** → Select **PostgreSQL**
3. Give it a name (e.g., "campus-gigs-db")
4. Select your region (same as your web service)
5. Choose **Free** tier
6. Click **Create Database**
7. Copy the **Internal Database URL** (starts with `postgresql://`)

### Option B: Neon (Free PostgreSQL)
1. Go to [https://neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)


## Step 2: Test Locally First (Optional)

If you want to test with PostgreSQL locally before deploying:

### Docker Option (Easiest):
```bash
# Start PostgreSQL in Docker
docker run --name campus-gigs-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=campusgigs -p 5432:5432 -d postgres

# Create .env.local with:
DATABASE_URL="postgresql://postgres:password@localhost:5432/campusgigs"
```

### Or use your DATABASE_URL from above

Then run:
```bash
npm run db:push
npm run dev
```

---

## Step 3: Deploy to Vercel
Render

### 1. Go to Render Project Environment Variables
1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Select your web service: **campus-gigs**
3. Go to **Environment** tab (left sidebar)

### 2. Add Environment Variables (IMPORTANT!)

Click **Add Environment Variable** for each:

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://campus_gigs_db_user:hPSCHDzAzJmIju94Afw9p3x7cEfEbKFw@dpg-d6n7jk24d50c73db1v90-a/campus_gigs_db`
- Click **Save** (it auto-deploys)

#### Variable 2: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: `MGQ3OGRjNGMtYzFkNy00NDMzLTkyNDEtMDUzZWY4MjgzZjNjMTMzNzY1MTc3ODYzOTA4NjQ0NzMyODQ5ODI4OQ==`
- Click **Save**

#### Variable 3: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://campustaskhive.onrender.com`
- Click **Save**

#### Variable 4: ADMIN_REGISTRATION_CODE
- **Key**: `ADMIN_REGISTRATION_CODE`
- **Value**: `110238870`
- Click **Save**

### 3. Trigger a Manual Deploy (Optional)
1. Go back to the **Deployments** page
2. Click **Clear build cache & deploy** button
3. Wait for deployment to complete

### 4. Or Push Code to Trigger Auto-Deploy
```bash
git add .
git commit -m "Fix: Switch to PostgreSQL for Render deployment"
git push origin main
```
Render will automatically redeploy when it detects new commits.

---

## Step 4: Run Database Migrations on Render

After the environment variables are set and deployed, Render will run `npm run build` (which includes `prisma generate`). The database schema will be synced automatically.

To manually sync if needed:

### Using Render Shell (Recommended):
1. Go to your service on Render Dashboard
2. Go to **Shell** tab
3. Run:
```bash
npm run db:push
```

This will sync your Prisma schema with the PostgreSQL database.
---

## Step 5: Verify the Fix

### Test Signup
1. Go to [https://campustaskhive.onrender.com/signup/client](https://campustaskhive.onrender.com/signup/client)
2. Fill in the form:
   - Name: Test Client
   - Username: testclient123
   - Phone: +254700000000 (optional)
   - Password: Password123! (8+ chars)
   - Confirm Password: Password123!
3. Click Sign Up
4. You should see a redirect to login with success message

### If Still Failing:
1. Check Render deployment logs:
   - Go to [https://dashboard.render.com](https://dashboard.render.com)
   - Select your web service
   - Click **Logs** tab
   - Look for error messages about database connection

2. Verify environment variables are set:
   - Go to **Environment** tab
   - Check all 4 variables are present: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_REGISTRATION_CODE`

3. Test the API directly:
   ```bash
   curl -X POST https://campustaskhive.onrender.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test",
       "username": "test123",
       "password": "TestPassword123!",
       "role": "CLIENT"
     }'
   ```

---

## Common Issues & Solutions

### Issue: "DATABASE_URL is not set"
**Solution**: Make sure you added the DATABASE_URL environment variable in Render Environment settings. Wait 2-3 minutes for the redeploy to complete.

### Issue: "Database schema mismatch"
**Solution**: Use Render Shell to run:
```bash
npm run db:push
```

### Issue: "Connection timeout" or "Can't reach database"
**Solutions**:
1. Make sure your PostgreSQL database is running (check Render Dashboard)
2. Verify the connection string is copy-pasted correctly
3. If using external database (Neon/Railway), whitelist Render IPs or disable IP restrictions
4. Check the internal/external database URL is correct (Render Postgres uses internal URLs)

### Issue: Still seeing old error after changes
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Wait 2-3 minutes for Render to finish deploying
3. Check Render Dashboard **Logs** for deployment errors
4. Do a hard refresh (Ctrl+F5)

## Next Steps

1. **Create PostgreSQL database** (Option A: Render Postgres is easiest since it's on the same platform)
2. **Add 4 environment variables** to Render (Step 3)
3. **Push code or manually redeploy** (Step 3, item 3 or 4)
4. **Test the signup** at [https://campustaskhive.onrender.com/signup/client](https://campustaskhive.onrender.com/signup/client)

---

## Need Help?

If you're still experiencing issues:
1. Check [Render Logs](https://dashboard.render.com) for detailed database connection errors
2. Verify all 4 environment variables are set correctly in Render **Environment** tab
3. Make sure DATABASE_URL is a valid PostgreSQL connection string
4. For Render Postgres, use the **Internal Database URL** (not external)
5. Run `npm run db:push` using Render Shell to sync the database schema
