# NutriFlow - Deployment & Scaling Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Production Deployment](#production-deployment)
3. [Scaling to 1000+ Users](#scaling-to-1000-users)
4. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development Setup

### Step 1: Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 2: Create Environment Files

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nutriflow
OPENAI_API_KEY=sk-your-key-here
STRIPE_SECRET_KEY=sk_test_key_here
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Start Services

**Terminal 1 - MongoDB (if local):**
```bash
# Install MongoDB if needed (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Should see: ✅ Server running on port 5000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Should see: ▲ Next.js ready on http://localhost:3000
```

### Step 4: Verify Setup

```bash
# Test backend health
curl http://localhost:5000/

# Expected response:
# {"status":"ok","message":"NutriFlow API is running"}

# Visit frontend
# http://localhost:3000/login
```

---

## Production Deployment

### Option A: Vercel (Recommended for Full Stack)

#### Backend Deployment to Vercel

1. **Prepare backend for Vercel:**

```bash
# Create backend/vercel.json
```

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "MONGO_URI": "@mongo_uri",
    "JWT_SECRET": "@jwt_secret",
    "OPENAI_API_KEY": "@openai_api_key",
    "STRIPE_SECRET_KEY": "@stripe_secret_key",
    "FRONTEND_URL": "@frontend_url",
    "NODE_ENV": "production"
  }
}
```

2. **Deploy:**

```bash
npm i -g vercel
cd backend
vercel
# Follow prompts, link to new project
# Add environment variables in Vercel dashboard
```

3. **Get API URL:**
   - Copy from Vercel dashboard (e.g., `https://nutriflow-api.vercel.app`)

#### Frontend Deployment to Vercel

1. **Deploy:**

```bash
cd frontend
vercel
```

2. **Add environment variables:**
   - Go to Vercel project settings
   - Add `NEXT_PUBLIC_API_URL=https://your-api.vercel.app`
   - Redeploy

#### Update Production URLs

Backend `.env` on Vercel:
```
FRONTEND_URL=https://nutriflow.vercel.app
```

Frontend `env` on Vercel:
```
NEXT_PUBLIC_API_URL=https://nutriflow-api.vercel.app
```

---

### Option B: Railway.app (Simpler Alternative)

#### Backend Deploy

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add environment variables
railway variables set MONGO_URI=your_mongo_uri
railway variables set JWT_SECRET=your_secret
railway variables set OPENAI_API_KEY=your_key
railway variables set STRIPE_SECRET_KEY=your_key
railway variables set FRONTEND_URL=https://your-frontend.domain

# Deploy
railway up
```

#### Frontend Deploy

```bash
cd frontend
railway init
railway variables set NEXT_PUBLIC_API_URL=your-api-url
railway up
```

---

### Option C: Self-Hosted (AWS/DigitalOcean)

#### Backend on AWS EC2

```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. SSH into instance
ssh -i key.pem ubuntu@your-instance.com

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone repo
git clone https://github.com/your-repo/nutriflow.git
cd nutriflow/backend

# 5. Install & setup
npm install
cp .env.example .env
# Edit .env with production values

# 6. Install PM2 for process management
sudo npm i -g pm2

# 7. Start application
pm2 start src/server.js --name "nutriflow-api"
pm2 startup
pm2 save

# 8. Setup reverse proxy (Nginx)
sudo apt-get install nginx
```

**Nginx config (`/etc/nginx/sites-available/default`):**
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Get SSL certificate
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

#### Frontend on Netlify

```bash
cd frontend
npm run build
# Drag drop `out` folder to Netlify
# Or:
npm i -g netlify-cli
netlify deploy --prod --dir=.next
```

---

## Scaling to 1000+ Users

### Database Optimization

#### 1. MongoDB Atlas Setup (Recommended)

```bash
# Create cluster on MongoDB Atlas
# - Choose M10+ tier for production
# - Enable auto-scaling
# - Enable backups
# - Add IP whitelist
```

**Performance indexing:**

```javascript
// Add to createMealPlan controller
// mealPlanSchema.index({ user: 1, createdAt: -1 });
// mealPlanSchema.index({ user: 1, goal: 1 });
```

#### 2. Add Redis Cache

```bash
# Install Redis
brew install redis  # macOS
# or use Redis Cloud service

# Update backend package.json
npm install redis ioredis

# Cache meal recommendations for 30 minutes
```

```javascript
// backend/src/services/cacheService.js
import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

export const cacheGetMealPlan = async (userId) => {
  const cached = await redisClient.get(`meals:${userId}`);
  return cached ? JSON.parse(cached) : null;
};

export const cacheMealPlan = async (userId, data, ttl = 1800) => {
  await redisClient.setEx(
    `meals:${userId}`,
    ttl,
    JSON.stringify(data)
  );
};
```

### API Optimization

#### Rate Limiting Tiers

```javascript
// backend/src/app.js
import rateLimit from 'express-rate-limit';

const freeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,  // Free users: 10 requests
  keyGenerator: (req) => req.user?._id || req.ip
});

const premiumLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,  // Premium: 100 requests
  keyGenerator: (req) => req.user?._id || req.ip
});

app.use('/api/meal-plans', (req, res, next) => {
  const limiter = req.user?.isPremium ? premiumLimiter : freeLimiter;
  limiter(req, res, next);
});
```

#### Pagination for Large Datasets

```javascript
// backend/src/controllers/mealPlanController.js

export const getMealPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await MealPlan.countDocuments({ user: req.user._id });
    const plans = await MealPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      plans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Frontend Optimization

#### Code Splitting

```typescript
// frontend/app/dashboard/page.tsx - Already optimized with dynamic imports
import dynamic from 'next/dynamic';

const MealPlanForm = dynamic(() => import('@/components/MealPlanForm'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});
```

#### Image Optimization

```typescript
import Image from 'next/image';

// Use next/image for automatic optimization
<Image 
  src="/nutrient-badge.png"
  alt="nutrients"
  width={50}
  height={50}
/>
```

### Infrastructure Scaling

#### Load Balancing

**Using Vercel:** Automatic ✅

**Using Railway/DigitalOcean:**

```bash
# Option 1: HAProxy
sudo apt-get install haproxy

# Option 2: AWS Application Load Balancer (if using EC2)
# Configure in AWS console
```

#### Auto-scaling Backend

```yaml
# docker-compose.yml for Kubernetes
version: '3.8'
services:
  backend:
    image: your-registry/nutriflow-api
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    replicas: 3  # Auto-scale to 3 instances
```

### Monitoring & Analytics

#### Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/tracing
```

```javascript
// backend/src/server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.errorHandler());
```

#### Application Monitoring (New Relic)

```bash
npm install newrelic
```

```javascript
// Add to top of backend/src/server.js
require('newrelic');
```

#### Analytics

```bash
npm install posthog-node  # or mixpanel
```

```javascript
// Track key events
const posthog = new PostHog('ph_xxxxx');

posthog.capture({
  distinctId: user._id,
  event: 'meal_plan_created',
  properties: { goal, isPremium: user.isPremium }
});
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check backend health
curl https://api.your-domain.com/api/health

# Check MongoDB connection
# In backend logs, you'll see: ✅ MongoDB connected: YOUR_HOST
```

### Database Maintenance

```bash
# MongoDB Atlas: Automated backups (included)
# Manual backup:
mongodump --uri mongodb+srv://user:pass@cluster.mongodb.net/nutriflow

# Restore from backup:
mongorestore --uri mongodb+srv://user:pass@cluster.mongodb.net ./dump
```

### Log Monitoring

```bash
# Vercel: Built-in logs (Vercel dashboard)
# Railway: vercel logs
# Self-hosted: tail -f /var/log/nutriflow.log
```

### Security Maintenance

- [ ] Rotate JWT_SECRET every 6 months
- [ ] Update dependencies monthly: `npm audit fix`
- [ ] Review API logs weekly
- [ ] Test backup restoration monthly
- [ ] Update SSL certificates (auto with Let's Encrypt)

### Performance Checks

```javascript
// Monitor slow endpoints
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow request: ${req.path} took ${duration}ms`);
    }
  });
  next();
});
```

---

## Cost Estimates (for 1000 users)

| Component | Service | Est. Monthly | Notes |
|-----------|---------|--------------|-------|
| API Server | Vercel/Railway | $0-50 | Included in free tier |
| Frontend | Vercel | $0-20 | Free tier works |
| Database | MongoDB Atlas | $50-100 | M10 cluster |
| Cache | Redis Cloud | $15-30 | For optimization |
| CDN | Cloudflare | $0-20 | Free tier works |
| **Total** | | **$65-220** | Scales with users |

---

**Happy deploying! 🚀**
