# NutriFlow - AI-Powered Meal Planning SaaS

NutriFlow is a production-ready SaaS application that generates personalized meal plans using the Mifflin-St Jeor calorie calculation formula. Users can track their fitness goals, upgrade to premium plans, and receive realistic meal recommendations.

## 🚀 Features

✅ **Health Metrics-Based Calorie Calculation**
- Mifflin-St Jeor BMR formula
- Activity level adjustments (1.2 - 1.9x)
- Goal-based TDEE calculation (lose/maintain/gain)

✅ **Structured Meal Plans**
- Breakfast, Lunch, Dinner, Snacks
- Realistic meal recommendations
- Calorie distribution per meal

✅ **Free vs Premium Model**
- Free users: 1 meal plan
- Premium users: Unlimited meal plans
- Easy upgrade pathway

✅ **Modern SaaS UI**
- Responsive design (mobile-first)
- Gradient layouts & modern components
- Loading states & empty states
- User-friendly error messages

✅ **Full Authentication**
- JWT-based auth
- Register & Login pages
- Protected routes
- Session management

✅ **Monetization Ready**
- Stripe integration ready
- Premium upgrade endpoint
- Payment session creation

## 📋 Project Structure

```
NutriFlow/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middlewares/       # Auth, error handling
│   │   ├── config/            # Database config
│   │   ├── app.js             # Express app
│   │   └── server.js          # Entry point
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                   # Next.js 16 App
│   ├── app/
│   │   ├── (auth)/            # Login/Register pages
│   │   ├── dashboard/         # Main meal plan UI
│   │   └── layout.tsx         # Root layout
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API client
│   │   └── utils/             # Helpers (auth, etc)
│   ├── .env.example           # Environment template
│   └── package.json
│
└── docs/                       # Documentation
```

## 🛠️ Quick Start

### Prerequisites
- Node.js v18+ 
- MongoDB (local or Atlas)
- OpenAI API key (optional, for AI coach feature)
- Stripe API keys (optional, for payments)

### 1. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your values
# MONGO_URI=mongodb://localhost:27017/nutriflow
# JWT_SECRET=your_secret_key_here (min 32 chars)
# OPENAI_API_KEY=sk-...
# STRIPE_SECRET_KEY=sk_...

# Install dependencies
npm install

# Start in development mode
npm run dev

# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend

# Copy environment template
cp .env.example .env.local

# Edit .env.local (usually just needs API URL)
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Install dependencies
npm install

# Start development server
npm run dev

# App runs on http://localhost:3000
```

### 3. Test the App

1. **Register**: Go to http://localhost:3000/register
2. **Login**: Create account and sign in
3. **Generate Plan**: Fill your metrics (weight, height, age, gender, activity)
4. **View Plans**: See personalized meal recommendations
5. **Upgrade**: Test premium features (upgrade button available)

## 📊 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register      # Create new user
POST   /api/auth/login         # Login user
GET    /api/auth/profile       # Get user profile (protected)
```

### Meal Plan Endpoints

```
POST   /api/meal-plans         # Create meal plan (protected)
GET    /api/meal-plans         # Get all user plans (protected)
DELETE /api/meal-plans/:id     # Delete plan (protected)
```

### Payment Endpoints

```
POST   /api/payments/upgrade-premium           # Upgrade to premium
POST   /api/payments/create-checkout-session   # Stripe checkout
```

### Health Check

```
GET    /api/health     # Server health status
GET    /                # API root status
```

## 🧮 Calorie Calculation Formula

### Basal Metabolic Rate (BMR) - Mifflin-St Jeor:

**Male:**
```
BMR = 10×weight(kg) + 6.25×height(cm) - 5×age + 5
```

**Female:**
```
BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 161
```

### Total Daily Energy Expenditure (TDEE):

```
TDEE = BMR × Activity Level Multiplier

Activity Levels:
- Sedentary (little exercise): 1.2
- Light (1-3x/week): 1.375
- Moderate (3-5x/week): 1.55
- Active (6-7x/week): 1.725
- Very Active (physical job): 1.9
```

### Goal-Based Calories:

```
- Weight Loss: TDEE × 0.85 (15% deficit)
- Maintenance: TDEE
- Muscle Gain: TDEE × 1.15 (15% surplus)
```

### Meal Distribution:

```
- Breakfast: 25%
- Lunch: 35%
- Snacks: 10%
- Dinner: 30%
```

## 🚀 Production Deployment

### Environment Variables (Production)

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nutriflow
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
JWT_SECRET=generate-strong-random-string-32-chars-min
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env.local or build-time):**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Deployment Checklist

- [ ] Database: MongoDB Atlas cluster created & secured
- [ ] Backend API: Deploy to Vercel, Heroku, or railway.app
- [ ] Frontend: Deploy to Vercel
- [ ] Environment variables: Set in hosting platform
- [ ] SSL/HTTPS: Enabled on all domains
- [ ] CORS: Configured for production domain
- [ ] Rate limiting: Enabled (currently 100 req/15min)
- [ ] Error monitoring: Set up Sentry or similar
- [ ] Database backups: Enabled & tested
- [ ] API keys: Rotated & secured

### Recommended Hosts

**Backend:**
- ✅ Vercel (serverless)
- ✅ Railway.app (simple & affordable)
- ✅ Heroku (classic, limited free tier)
- ✅ AWS EC2 (scalable)

**Frontend:**
- ✅ Vercel (optimal for Next.js)
- ✅ Netlify (good alternative)
- ✅ Railway.app

**Database:**
- ✅ MongoDB Atlas (managed, free tier available)
- ✅ AWS DocumentDB
- ✅ Self-hosted MongoDB

## 📈 Scaling to 1000+ Users

### Current Limitations & Solutions

| Challenge | Solution |
|-----------|----------|
| Single MongoDB instance | Use MongoDB Atlas auto-scaling clusters |
| API rate limiting | Implement tiered rate limits (free: 10, paid: 100) |
| No caching | Add Redis for meal plan templates |
| No CDN | Use Cloudflare or AWS CloudFront |
| No async jobs | Add Bull queue for email/SMS notifications |
| Single server | Deploy frontend to CDN, backend to multiple instances |
| No analytics | Integrate PostHog or Mixpanel |

### Architecture for Scale (1000+ users)

```
┌─────────────────────────────────────┐
│     Cloudflare CDN / CloudFront     │
└────────────────┬────────────────────┘
                 │
┌─────────────────┴─────────────────┐
│  Vercel (Frontend)  │ Railway/AWS (Backend)
└─────────────────┬─────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐
│ Instance 1 │   │ Instance 2 │   │ Instance 3 │
└────────────┘   └────────────┘   └────────────┘
    │            │            │
    └────────────┼────────────┘
                 │
        ┌────────▼────────┐
        │  Load Balancer  │
        └────────┬────────┘
                 │
        ┌────────▼──────────────────┐
        │  MongoDB Atlas Cluster     │
        │  (auto-scaling, backups)   │
        └──────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐  ┌───▼────┐  ┌───▼────┐
│ Redis  │  │ S3/GCS │  │ Sentry │
│ Cache  │  │ Storage│  │Monitoring
└────────┘  └────────┘  └────────┘
```

### Optimization Techniques

1. **Database**
   - Indexing: Add indexes on `user_id`, `createdAt`
   - Sharding: Shard by user_id for massive scale
   - Archiving: Archive old meal plans to cold storage

2. **API**
   - Pagination: Implement for meal plans list
   - Caching: Cache meal recommendations (30 min)
   - Compression: Enable gzip/brotli

3. **Frontend**
   - Code splitting: Automatic via Next.js
   - Image optimization: Use next/image
   - Service workers: Offline support

4. **Monitoring**
   - Error tracking: Sentry
   - Performance: Datadog, New Relic
   - Logs: ELK Stack or Datadog

## 🔐 Security Checklist

- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] JWT tokens with 7-day expiry
- [ ] HTTPS enforced everywhere
- [ ] CORS whitelist configured
- [ ] Rate limiting enabled
- [ ] SQL injection: Using Mongoose (NoSQL safe)
- [ ] XSS protection: Via React + CSP headers
- [ ] CSRF tokens: Consider for form submissions
- [ ] Secrets management: Use env vars, never hardcode
- [ ] API validation: Implement Joi/Zod schemas

## 📝 Available Scripts

### Backend
```bash
npm run dev      # Start development server with watch
npm start        # Start production server
npm run lint     # Run ESLint
```

### Frontend
```bash
npm run dev      # Start Next.js dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run Next.js/ESLint
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
# Ensure MONGO_URI is correct
# Check if port 5000 is available
```

### Frontend API errors
```bash
# Verify NEXT_PUBLIC_API_URL is set
# Check if backend server is running
# Verify CORS settings in backend
```

### JWT Token errors
```bash
# Ensure JWT_SECRET is set in .env
# Token may be expired (7 day limit)
# Clear localStorage and re-login
```

## 📚 Technology Stack

**Backend:**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication
- Stripe SDK
- OpenAI SDK
- bcryptjs for password hashing
- Helmet for security
- Morgan for logging

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- TailwindCSS
- React Hot Toast
- Client-side routing

**DevTools:**
- ESLint
- Git

## 📄 License

MIT - Feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

Contributions welcome! Please create a pull request with:
- Clear description of changes
- Tests for new features
- Updated documentation

---

**Status**: Production Ready ✅
**Version**: 1.0.0
**Last Updated**: 2026-04-11
