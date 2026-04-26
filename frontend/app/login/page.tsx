"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { Input } from "@/components/FormInputs";
import { Button } from "@/components/Button";
import { Card, CardBody } from "@/components/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      if (!data.token) throw new Error("Token was not returned");

      setToken(data.token);
      toast.success("Welcome back! 🎉");
      router.replace("/generate-plan");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 overflow-x-hidden">
      <div className="mx-auto max-w-md px-2">
        <Card variant="elevated" padded className="border border-slate-700 bg-slate-800/95 shadow-lg">
          <CardBody className="space-y-6">
            <div className="text-center space-y-3 pb-2 border-b border-slate-800">
              <div className="inline-flex items-center justify-center rounded-full bg-blue-500/10 px-4 py-1 text-sm text-blue-200">
                First class nutrition
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">Welcome back</p>
                <p className="mt-2 text-sm text-slate-400">Sign in to generate your premium AI meal plan.</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="you@example.com"
                error={errors.email}
                required
                icon="📧"
              />

              <Input
                label="Password"
                type="password"
                inputMode="text"
                autoComplete="current-password"
                autoCapitalize="none"
                spellCheck={false}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                placeholder="••••••••"
                error={errors.password}
                required
                icon="🔒"
              />

              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-500">
              Don’t have an account?
              <Link href="/register" className="ml-1 text-blue-400 hover:text-blue-300 font-semibold">
                Create one
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
