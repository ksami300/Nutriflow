# 🔐 Environment Variables Setup Guide

## 📋 Overview

This document explains all environment variables needed for NutriFlow to run properly.

---

## 🔙 Backend Configuration

### File Location
```
backend/.env
```

### Required Variables

#### Server
```env
PORT=5000
NODE_ENV=development
```
- **PORT**: Server port (default: 5000)
- **NODE_ENV**: Environment (development/production)

#### Database
```env
MONGO_URI=mongodb://127.0.0.1:27017/nutriflow
```
- Local: `mongodb://127.0.0.1:27017/nutriflow`
- Remote: Get from MongoDB Atlas connection string

#### JWT Authentication
```env
JWT_SECRET=your_random_secret_key_at_least_32_chars
```
- Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Used for signing JWT tokens

#### CORS Configuration
```env
FRONTEND_URL=http://localhost:3000
```
- Local: `http://localhost:3000`
- Production: `https://your-domain.com`
- **Important**: Backend uses CORS to allow only this URL

#### Stripe Integration
```env
STRIPE_SECRET_KEY=sk_test_xxxxx_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_xxxx_your_webhook_secret
```
- Get from: https://dashboard.stripe.com/apikeys
- Webhook secret: https://dashboard.stripe.com/webhooks

#### Email Service (Gmail)
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```
- Use Gmail App Password (not regular password)
- Enable 2FA, then generate app password: https://myaccount.google.com/apppasswords

#### AI Service (Optional)
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
```
- Get from: https://platform.openai.com/api-keys
- Used for AI Coach feature

---

## 🎨 Frontend Configuration

### File Location
```
frontend/.env.local
```

### Required Variables

#### API Connection
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
- Local: `http://localhost:5000`
- Production: `https://api.your-domain.com`
- **Important**: Must start with `NEXT_PUBLIC_` to be accessible in browser

---

## 🚀 Deployment URLs

### Vercel Frontend
```env
NEXT_PUBLIC_API_URL=https://nutriflow-api.vercel.app
```

### Railway Backend
```env
FRONTEND_URL=https://nutriflow-frontend.vercel.app
STRIPE_WEBHOOK_SECRET=<production_secret>
JWT_SECRET=<production_random_string>
```

---

## ✅ Local Development Checklist

- [ ] Create `backend/.env` from `backend/.env.example`
- [ ] Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5000`
- [ ] Start MongoDB (local or Atlas)
- [ ] Generate JWT_SECRET
- [ ] Set up Stripe test keys
- [ ] Set up Gmail app password
- [ ] Run `npm install` in both folders
- [ ] Run backend: `npm run dev`
- [ ] Run frontend: `npm run dev`
- [ ] Test on http://localhost:3000

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT_SECRET** - At least 32 characters
3. **Regenerate STRIPE_WEBHOOK_SECRET** for production
4. **Use Gmail app passwords** - Not your actual password
5. **Rotate secrets regularly** - Monthly for production
6. **Use environment-specific URLs** - Never hardcode localhost

---

## 🐛 Troubleshooting

### Frontend can't reach backend
```
Error: Failed to fetch
Fix: Check NEXT_PUBLIC_API_URL in frontend/.env.local
```

### CORS error
```
Error: No 'Access-Control-Allow-Origin' header
Fix: Ensure backend FRONTEND_URL matches frontend URL
```

### JWT token invalid
```
Error: Unauthorized
Fix: Regenerate JWT_SECRET if needed
```

### Stripe not working
```
Error: Stripe error
Fix: Verify STRIPE_SECRET_KEY is set correctly
```

### Email not sending
```
Error: Email error
Fix: Generate Gmail app password (not regular password)
```

---

## 📚 Reference

- [Stripe Documentation](https://stripe.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
