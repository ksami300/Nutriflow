"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { Input } from "@/components/FormInputs";
import { Button } from "@/components/Button";
import { Card, CardBody, Alert } from "@/components/Card";

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
      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50 to-accent-light/20 p-4">
      <div className="w-full max-w-md animate-slideUp">
        <Card variant="elevated" padded>
          <CardBody className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 mb-4">
              <div className="text-4xl mb-2">🎯</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-light bg-clip-text text-transparent">
                NutriFlow
              </h1>
              <p className="text-neutral-600 text-sm">Welcome back to your nutrition journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                placeholder="••••••••"
                error={errors.password}
                required
                icon="🔒"
                hint="Must be at least 6 characters"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={loading}
                className="mt-6"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">New to NutriFlow?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link href="/register">
              <Button
                variant="outline"
                size="md"
                fullWidth
                type="button"
              >
                Create Account
              </Button>
            </Link>

            {/* Test Credentials */}
            <Alert
              type="info"
              title="Demo Login"
              description="Test with: demo@example.com / password123"
            />
          </CardBody>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600 mt-6">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-primary-600 hover:underline font-medium">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}