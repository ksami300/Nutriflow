"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { error } from "@/lib/logger";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await loginUser({ email, password });

      if (!data?.token) {
        throw new Error("Login response did not include an auth token.");
      }

      setToken(data.token);
      router.push("/dashboard");
    } catch (err: any) {
      error("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.error || err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto w-full max-w-md rounded-[32px] border border-slate-200 bg-white px-6 py-10 shadow-sm shadow-slate-200/60 sm:px-8">
        <h1 className="text-3xl font-semibold text-slate-950">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to access your personalized meal plans.</p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[28px] bg-emerald-600 px-5 py-4 text-base font-semibold text-white transition duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
