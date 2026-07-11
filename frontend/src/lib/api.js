import axios from "axios";
import { getToken, removeToken } from "@/lib/auth";
import { error, warn } from "@/lib/logger";

// =======================
// BASE CONFIG
// =======================

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// =======================
// REQUEST INTERCEPTOR
// =======================

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =======================
// RESPONSE INTERCEPTOR
// =======================

API.interceptors.response.use(
  (res) => res,
  (err) => {
    error("❌ API ERROR:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      warn("🔒 Unauthorized → logout");
      removeToken();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

// =======================
// AUTH
// =======================

export const registerUser = async (data) => {
  const res = await API.post("/api/auth/register", data);
  return res.data.data;
};

export const loginUser = async ({ email, password }) => {
  const res = await API.post("/api/auth/login", { email, password });
  return res.data.data;
};

export const getMe = async () => {
  const res = await API.get("/api/auth/profile");
  return res.data.data;
};

export const logoutUser = async () => {
  await API.post("/api/auth/logout");
  removeToken();
};

// =======================
// MEAL PLANS
// =======================

export const generatePlan = async (data) => {
  try {
    const res = await API.post("/api/meal-plans", data);
    return res.data?.data;
  } catch (err) {
    error("Generate plan error:", err.response?.data || err.message);
    throw err;
  }
};

export const getMyPlans = async () => {
  try {
    const res = await API.get("/api/meal-plans");
    return res.data?.data || [];
  } catch (err) {
    error("Get plans error:", err.response?.data || err.message);
    throw err;
  }
};

export const deletePlan = async (id) => {
  try {
    const res = await API.delete(`/api/meal-plans/${id}`);
    return res.data?.data;
  } catch (err) {
    error("Delete plan error:", err.response?.data || err.message);
    throw err;
  }
};

export const getGroceryList = async (id) => {
  try {
    const res = await API.get(`/api/meal-plans/${id}/groceries`);
    return res.data?.data;
  } catch (err) {
    error("Get grocery list error:", err.response?.data || err.message);
    throw err;
  }
};

export const sharePlan = async (id) => {
  try {
    const res = await API.post(`/api/meal-plans/${id}/share`);
    return res.data?.data;
  } catch (err) {
    error("Share plan error:", err.response?.data || err.message);
    throw err;
  }
};
// =======================
// PAYMENTS
// =======================

export const createCheckoutSession = async () => {
  const res = await API.post("/api/payments/create-checkout");
  return res.data.data;
};

export const getSubscriptionStatus = async () => {
  const res = await API.get("/api/payments/status");
  return res.data.data;
};

// =======================
// HEALTH CHECK (🔥 OVO FALI)
// =======================

export const checkHealth = async () => {
  const res = await API.get("/api/health");
  return res.data.data;
};

export default API;