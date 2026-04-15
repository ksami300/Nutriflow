# 🚀 NutriFlow Deployment Checklist

## Pre-Deployment

### Environment Variables
- [ ] Backend `.env` configured with all required vars
- [ ] Frontend `.env.local` configured with API URL
- [ ] `STRIPE_SECRET_KEY` set to production key
- [ ] `JWT_SECRET` set to strong random string (32+ chars)
- [ ] `FRONTEND_URL` matches frontend domain
- [ ] `MONGO_URI` connects to production MongoDB
- [ ] All sensitive keys are NOT in git (check .gitignore)

### Code Quality
- [ ] No `console.log()` statements left
- [ ] No hardcoded URLs (all use env vars)
- [ ] All error handlers working
- [ ] CORS allows only frontend URL
- [ ] JWT middleware on all protected routes

### Testing
- [ ] Register flow works end-to-end
- [ ] Login flow works end-to-end
- [ ] Meal plan generation works
- [ ] Premium upgrade redirects to Stripe
- [ ] API returns proper error messages
- [ ] All auth headers included in requests

---

## Backend Deployment (Railway/Heroku)

### Step 1: Create Backend
```bash
# Option A: Railway
railway link
railway variables set PORT=5000
railway variables set MONGO_URI=<production_uri>
railway variables set JWT_SECRET=<secure_random>
railway variables set STRIPE_SECRET_KEY=sk_live_xxx
railway variables set STRIPE_WEBHOOK_SECRET=whsec_xxx
railway variables set FRONTEND_URL=https://your-frontend.com
railway variables set EMAIL_USER=your@gmail.com
railway variables set EMAIL_PASS=app_password_here
railway variables set OPENAI_API_KEY=sk-proj-xxx
railway up

# Option B: Heroku
heroku create nutriflow-api
heroku config:set PORT=5000 MONGO_URI=<uri> JWT_SECRET=<secret>
git push heroku main
```

### Step 2: Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend.com/api/payments/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to backend environment

### Step 3: Verify Backend
```bash
curl https://your-backend.com/
# Should return: "API WORKING 🚀"

curl https://your-backend.com/api/health
# Should return: { "status": "OK", ... }
```

---

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
```bash
npm install -g vercel
vercel deploy --prod
```

### Step 2: Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.com
```

### Step 3: Rebuild & Deploy
```bash
vercel redeploy --prod
```

### Step 4: Verify Frontend
1. Visit your frontend URL
2. Test: Register → Login → Generate Plan
3. Check browser console for errors

---

## Database Setup

### MongoDB Atlas
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Replace `<password>` with database user password
4. Add connection string to backend `MONGO_URI`

### Collections
```
- users (auto-created)
  - name: string
  - email: string (unique)
  - password: string (hashed)
  - isPremium: boolean
  - stripeCustomerId: string
  - createdAt: date
  - updatedAt: date

- mealplans (auto-created)
  - user: ObjectId (ref: User)
  - goal: string
  - calories: number
  - macros: { protein, carbs, fats }
  - meals: array
  - createdAt: date
```

---

## Post-Deployment Verification

### API Endpoints
```bash
# Test Register
curl -X POST https://your-backend.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Test Login
curl -X POST https://your-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Test Protected Route (use token from login)
curl -X GET https://your-backend.com/api/meal-plans \
  -H "Authorization: Bearer <your_token>"
```

### Frontend Flow
1. **Register Page**: Can register new user
2. **Login Page**: Can login with email/password
3. **Dashboard**: Shows user profile & meal plans
4. **Generate Plan**: Creates plan with user inputs
5. **Delete Plan**: Removes plan from database
6. **Premium Upgrade**: Redirects to Stripe checkout

---

## Monitoring & Maintenance

### Daily
- [ ] Check error logs
- [ ] Verify API health endpoint
- [ ] Monitor database connections

### Weekly
- [ ] Check Stripe webhook logs
- [ ] Verify email deliverability
- [ ] Review user metrics

### Monthly
- [ ] Rotate JWT_SECRET (optional)
- [ ] Update dependencies (`npm audit fix`)
- [ ] Backup database
- [ ] Review security logs

---

## Rollback Plan

If deployment fails:
```bash
# Railway
railway revert --environment production

# Vercel
vercel rollback

# Manual
1. Restore previous .env values
2. Rebuild and redeploy
3. Verify API health
```

---

## Scaling Considerations

- Use MongoDB Atlas auto-scaling
- Enable CDN for frontend
- Cache frequently accessed data
- Implement rate limiting
- Set up monitoring (Sentry/DataDog)

---

## Troubleshooting

### Error: "Failed to fetch profile"
- Check JWT_SECRET consistency
- Verify Authorization header format

### Error: "CORS error on frontend"
- Compare FRONTEND_URL in backend with actual URL
- Check browser origin header

### Error: "Stripe checkout fails"
- Verify STRIPE_SECRET_KEY
- Check webhook secret endpoint
- Ensure customer email is valid

### Error: "Email not sending"
- Generate new Gmail app password
- Check EMAIL_USER/EMAIL_PASS
- Enable "Less secure app access" (if not using app password)
