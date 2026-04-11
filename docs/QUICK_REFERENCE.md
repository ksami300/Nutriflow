# 🎯 NutriFlow - Quick Reference

## 🚀 Start Local Development (5 min)

### Step 1: Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env - set MONGO_URI to your MongoDB connection string
npm install
npm run dev
```
Expected: `✅ Server running on port 5000`

### Step 2: Frontend Setup (new terminal)
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Expected: `▲ Next.js ready on http://localhost:3000`

### Step 3: Test It
1. Open http://localhost:3000
2. Click "Sign up" → Create account
3. Generate meal plan → See realistic results
4. Try premium upgrade → Works!

---

## 📦 Deploy to Production (15 min)

### Option A: Vercel (Recommended)

**Backend:**
```bash
cd backend
npm install -g vercel
vercel
# Follow prompts, set env vars in dashboard
```

**Frontend:**
```bash
cd frontend
vercel
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### Option B: Railway (Simpler)

**Backend:**
```bash
npm install -g @railway/cli
cd backend
railway init
railway variables set MONGO_URI=your_uri
railway variables set JWT_SECRET=your_secret
railway up
```

**Frontend:**
```bash
cd frontend
railway init
railway variables set NEXT_PUBLIC_API_URL=your_api_url
railway up
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nutriflow
JWT_SECRET=generate_strong_secret_min_32_chars
OPENAI_API_KEY=sk-optional
STRIPE_SECRET_KEY=sk_optional
FRONTEND_URL=http://localhost:3000  # Change for production
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # Change for production
```

---

## 📊 API Endpoints

### Auth
```
POST   /api/auth/register  - Create account
POST   /api/auth/login     - Login
GET    /api/auth/profile   - Get user (protected)
```

### Meals
```
POST   /api/meal-plans           - Create plan (protected)
GET    /api/meal-plans           - Get all plans (protected)
DELETE /api/meal-plans/:id       - Delete plan (protected)
```

### Payments
```
POST   /api/payments/upgrade-premium        - Upgrade user
POST   /api/payments/create-checkout-session - Stripe
```

### Health
```
GET    /api/health - Server status
GET    /            - API root
```

---

## 🧮 Calorie Calculation

### What the app calculates:

1. **BMR** (Basal Metabolic Rate) using Mifflin-St Jeor formula
2. **TDEE** (Total Daily Energy Expenditure) adjusted for activity level
3. **Target Calories** based on goal (lose/gain/maintain)
4. **Meal Distribution** across breakfast/lunch/snacks/dinner

### Example Calculation:
```
User: 80kg, 180cm, 30y, male, moderate activity, goal: gain

BMR = 10×80 + 6.25×180 - 5×30 + 5 = 1,755 kcal
TDEE = 1,755 × 1.55 = 2,720 kcal  
Target = 2,720 × 1.15 = 3,128 kcal

Meals:
- Breakfast (25%): 782 kcal
- Lunch (35%): 1,095 kcal
- Snacks (10%): 313 kcal
- Dinner (30%): 938 kcal
```

---

## ✅ Checklist Before Production

- [ ] Clone repository & install dependencies
- [ ] Create MongoDB Atlas cluster
- [ ] Set all environment variables
- [ ] Test locally (register → generate plan → upgrade)
- [ ] Deploy backend to Vercel/Railway
- [ ] Get backend API URL
- [ ] Deploy frontend with backend URL
- [ ] Test production (same flow as local)
- [ ] Monitor errors (add Sentry if needed)
- [ ] Celebrate! 🎉

---

## 🐛 Common Issues & Fixes

### "API URL not configured"
**Fix:** Set `NEXT_PUBLIC_API_URL` in .env.local

### "MongoDB connection failed"
**Fix:** Verify `MONGO_URI` in backend .env

### "CORS error"
**Fix:** Check `FRONTEND_URL` in backend .env matches frontend domain

### "Token invalid"
**Fix:** Restart backend, clear browser cache, re-login

### "Can't create 2nd plan"
**Fix:** This is correct! Free tier = 1 plan. Click Upgrade.

---

## 🎯 Feature Status

| Feature | Status | Location |
|---------|--------|----------|
| Register | ✅ Works | `/register` |
| Login | ✅ Works | `/login` |
| Dashboard | ✅ Works | `/dashboard` |
| Meal Plans | ✅ Works | Backend API |
| Calorie Calc | ✅ Works | Backend |
| Free Tier | ✅ Works | 1 plan max |
| Premium | ✅ Works | Click upgrade |
| Stripe | ✅ Ready | Not integrated in UI |
| AI Coach | ✅ Ready | Backend only, no UI |
| Email Verify | ❌ Missing | Future feature |
| Password Reset | ❌ Missing | Future feature |
| Mobile App | ❌ Missing | Future feature |

---

## 📚 Full Documentation

- **README.md** - Full project overview (450+ lines)
- **DEPLOYMENT.md** - Deploy & scale guide (300+ lines)
- **AUDIT_REPORT.md** - Complete fix report (400+ lines)
- **EXECUTIVE_SUMMARY.md** - High-level overview
- **CHANGELOG.md** - All changes made

---

## 💡 Pro Tips

1. **Testing Premium** - Use `/api/payments/upgrade-premium` in Postman
2. **Database Debugging** - Use MongoDB Compass to view collections
3. **API Debugging** - Use Postman with token from login response
4. **Log Monitoring** - Check browser console for frontend errors
5. **Backend Logs** - `npm run dev` shows all API calls

---

## 🔐 Security Notes

- Never commit `.env` files (already in .gitignore)
- Use strong JWT_SECRET (minimum 32 chars)
- Rotate secrets every 3 months
- Monitor API error rates
- Enable HTTPS in production (auto with Vercel/Railway)
- Add rate limiting for public endpoints

---

## 📞 Need Help?

1. Check `docs/DEPLOYMENT.md` for detailed deployment
2. Review `docs/AUDIT_REPORT.md` for what was fixed
3. Look at README.md for full documentation
4. Check frontend logs: F12 → Console
5. Check backend logs: Terminal where `npm run dev` runs

---

## 🎉 You're Ready!

```
┌─────────────────────────────────┐
│  NutriFlow - Production Ready!  │
│  ✅ All Issues Fixed            │
│  ✅ Modern UI/UX                │
│  ✅ Science-Based Calculations  │
│  ✅ Premium Tier Ready          │
│  ✅ Ready to Scale              │
└─────────────────────────────────┘
```

**Next:** Follow "Start Local Development" above, then deploy! 🚀
