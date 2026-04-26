"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { Input } from "@/components/FormInputs";
import { Button } from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import { Progress, Badge } from "@/components/UI";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const getPasswordStrengthLabel = (): { label: string; color: "error" | "warning" | "success"; value: number } => {
    if (passwordStrength < 25) return { label: "Weak", color: "error", value: 25 };
    if (passwordStrength < 50) return { label: "Fair", color: "warning", value: 50 };
    if (passwordStrength < 75) return { label: "Good", color: "warning", value: 75 };
    return { label: "Strong", color: "success", value: 100 };
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();
      if (!data.token) throw new Error("Token was not returned");

      setToken(data.token);
      toast.success("Welcome to NutriFlow! 🎉");
      router.replace("/generate-plan");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = getPasswordStrengthLabel();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 overflow-x-hidden">
      <div className="mx-auto max-w-md px-2">
        <Card variant="elevated" padded className="border border-slate-700 bg-slate-800/95 shadow-lg">
          <CardBody className="space-y-6">
            <div className="text-center space-y-3 pb-2 border-b border-slate-800">
              <div className="inline-flex items-center justify-center rounded-full bg-violet-500/10 px-4 py-1 text-sm text-violet-200">
                Premium sign up
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">Create your account</p>
                <p className="mt-2 text-sm text-slate-400">A clean, secure onboarding flow built for mobile.</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                inputMode="text"
                autoComplete="name"
                autoCapitalize="words"
                spellCheck={false}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="John Doe"
                error={errors.name}
                required
                icon="👤"
              />

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
                autoComplete="new-password"
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

              {password && (
                <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Password Strength</span>
                    <Badge label={strengthLabel.label} variant={strengthLabel.color} size="sm" />
                  </div>
                  <Progress value={strengthLabel.value} showValue={false} />
                  <p className="text-xs text-slate-500">Mix uppercase, lowercase, numbers & symbols for a stronger password.</p>
                </div>
              )}

              <Input
                label="Confirm Password"
                type="password"
                inputMode="text"
                autoComplete="new-password"
                autoCapitalize="none"
                spellCheck={false}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                }}
                placeholder="••••••••"
                error={errors.confirmPassword}
                required
                icon="✓"
              />

              <div className="flex items-start gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-500 accent-blue-500"
                />
                <label htmlFor="terms" className="leading-5">
                  I agree to the <Link href="#" className="text-blue-300 hover:text-blue-200">Terms of Service</Link> and <Link href="#" className="text-blue-300 hover:text-blue-200">Privacy Policy</Link>.
                </label>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-500">
              Already signed up?
              <Link href="/login" className="ml-1 text-blue-400 hover:text-blue-300 font-semibold">
                Sign in
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
