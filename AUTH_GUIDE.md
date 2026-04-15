# 🔐 Authentication & Authorization Guide

## JWT Token Flow

```
User             Frontend                Backend
 |                  |                       |
 |-- Register --->  |-- POST /auth/register >|
 |                  |<--- Token + User ---|
 |-- Save Token ->  |                       |
 |                  |                       |
 |-- Login -- -->   |-- POST /auth/login >|
 |                  |<--- Token + User ---|
 |-- Save Token ->  |                       |
 |                  |                       |
 |-- Create Plan --> |-- POST /meal-plans -->|
 |                  |+Authorization Header  |
 |                  |<--- Plan Data ---|
 |                  |                       |
```

---

## Frontend: Storing Token

### In localStorage
```typescript
// utils/auth.ts
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
```

### Register & Login
```typescript
// Register successful
const data = await fetch(...).then(r => r.json());
setToken(data.token); // Save token

// Login successful
const data = await fetch(...).then(r => r.json());
setToken(data.token); // Save token
```

---

## Frontend: Attaching Token to Requests

### Pattern 1: Direct Header in Fetch
```typescript
const token = localStorage.getItem("token");

fetch(`${API_URL}/api/meal-plans`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,  // ✅ Format: "Bearer {token}"
  },
  body: JSON.stringify({ ... }),
});
```

### Pattern 2: Centralized API Service
```typescript
// src/services/api.ts
export const createMealPlan = async (
  goal: string,
  weight: number,
  token: string
) => {
  const res = await fetch(`${API_URL}/api/meal-plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // ✅ Always include
    },
    body: JSON.stringify({ goal, weight }),
  });
  
  if (!res.ok) throw new Error("Failed");
  return res.json();
};
```

### Pattern 3: Get Token from localStorage
```typescript
const token = localStorage.getItem("token");

if (!token) {
  router.push("/login");
  return;
}

// Use token in all protected requests
```

---

## Backend: Verifying Token

### Auth Middleware
```javascript
// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    // Extract token from "Bearer {token}"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;  // Contains { id, iat, exp }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
```

### Protected Route Usage
```javascript
// routes/mealPlanRoutes.js
const authMiddleware = require("../middleware/authMiddleware");
const { generatePlan } = require("../controllers/mealPlanController");

// ✅ Auth middleware BEFORE controller
router.post("/", authMiddleware, generatePlan);
```

### Accessing User in Controller
```javascript
// controllers/mealPlanController.js
exports.generatePlan = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const userId = req.user.id;  // User is authenticated
    
    // Create meal plan for logged-in user
    const plan = await MealPlan.create({
      user: userId,
      goal: req.body.goal,
    });
    
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};
```

---

## Token Structure

### JWT Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### JWT Payload (decoded)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "iat": 1516239022,
  "exp": 1516325422
}
```

### Full Token Example
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MzI1NDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## Required Headers for Protected Routes

### ✅ Correct Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### ❌ Wrong Formats
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...        # Missing "Bearer"
Authorization: Bearertoken...                                  # Missing space
Authorization: bearer <token>                                  # Wrong case
X-Auth-Token: <token>                                          # Wrong header name
```

---

## Protected Routes

### Must Include Authorization Header
- ✅ POST `/api/meal-plans` - Create plan
- ✅ GET `/api/meal-plans` - List plans
- ✅ DELETE `/api/meal-plans/:id` - Delete plan
- ✅ POST `/api/payments/checkout` - Stripe checkout
- ✅ GET `/api/auth/profile` - User profile
- ✅ POST `/api/ai` - AI Coach questions

### No Authorization Needed
- ✅ POST `/api/auth/register` - Create account
- ✅ POST `/api/auth/login` - Login
- ✅ GET `/api/health` - Health check
- ✅ POST `/api/payments/webhook` - Stripe callback

---

## Error Responses

### Missing Token
```json
{
  "message": "No token",
  "status": 401
}
```

### Invalid Token
```json
{
  "message": "Unauthorized",
  "status": 401
}
```

### Expired Token
```json
{
  "message": "Unauthorized",
  "status": 401
}
```

### Fix: User must re-login to get new token
```typescript
// frontend
if (error.status === 401) {
  logout(); // Clear token and redirect to login
}
```

---

## Best Practices

### 1. Always Check for Token Before API Call
```typescript
const token = localStorage.getItem("token");
if (!token) {
  router.push("/login");
  return;
}
```

### 2. Handle 401 Responses
```typescript
fetch(url, {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    router.push("/login");
  }
  return res.json();
});
```

### 3. Logout on Token Expiry
```typescript
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
```

### 4. Backend: Always Verify JWT_SECRET
```env
# .env
JWT_SECRET=your_secure_random_32_char_string
```

### 5. Production: Use HTTPS Only
```
http://localhost:3000   # ✅ Local development
https://api.domain.com  # ✅ Production
```

---

## Testing Authorization

### Manual Testing with curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Get token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Use token in protected request
curl -X GET http://localhost:5000/api/meal-plans \
  -H "Authorization: Bearer $TOKEN"
```

### Postman Setup
1. Register and copy token
2. Add header: `Authorization: Bearer {token}`
3. Send request to protected endpoint

---

## Debugging

### Check localStorage
```javascript
// Browser console
localStorage.getItem("token")
```

### Verify Token Decode
```javascript
// At jwt.io
// Paste token to see decoded payload
```

### Check Headers in Network Tab
```
Headers → Request Headers → Authorization
Should show: Bearer eyJ...
```

### Backend Console
```javascript
console.log(req.headers.authorization);
console.log(req.user); // After auth middleware
```
