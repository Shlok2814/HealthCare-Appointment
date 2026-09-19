# 🚀 Deployment Guide: PulsePoint Health

This document details production deployment steps for the PulsePoint Health platform across modern cloud infrastructure providers.

---

## Architecture Overview

- **Frontend:** Single Page Application (SPA) deployed to **Vercel**, **Cloudflare Pages**, or **Netlify**.
- **Backend:** Node.js Express service deployed to **Render**, **Railway**, or **AWS ECS/App Runner**.
- **Database:** Managed PostgreSQL hosted on **Neon**, **Supabase**, or **AWS RDS**.

---

## 1. Database Provisioning (e.g. Neon Serverless)

1. Create a PostgreSQL project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the pooled connection string `DATABASE_URL`.
3. Run database migrations:
   ```bash
   cd backend
   DATABASE_URL="your-connection-string" npx prisma db push
   DATABASE_URL="your-connection-string" npx ts-node prisma/seed.ts
   ```

---

## 2. Backend Deployment (Render / Railway)

### Environment Variables
Set the following environment variables in your server dashboard:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-frontend-app.vercel.app
JWT_SECRET=your_production_secure_secret_string
JWT_EXPIRES_IN=7d
SLOT_HOLD_MINUTES=5
```

### Build & Start Commands
- **Build Command:**
  ```bash
  npm install && npm run build:shared && cd backend && npx prisma generate && npm run build
  ```
- **Start Command:**
  ```bash
  node backend/dist/server.js
  ```

---

## 3. Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Set the **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variables:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com/api/v1
   ```
5. Click **Deploy**.

---

## 4. Docker Deployment

To run the complete platform with Docker:
```bash
docker-compose up -d
```
