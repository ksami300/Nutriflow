"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { Input } from "@/components/FormInputs";
import { Button } from "@/components/Button";
import { Card, CardBody, Alert } from "@/components/Card";
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

  // Calculate password strength
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
      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = getPasswordStrengthLabel();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50 to-accent-light/20 p-4">
      <div className="w-full max-w-md animate-slideUp">
        <Card variant="elevated" padded>
          <CardBody className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 mb-4">
              <div className="text-4xl mb-2">💪</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-light bg-clip-text text-transparent">
                NutriFlow
              </h1>
              <p className="text-neutral-600 text-sm">Start your transformation today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
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

              <div className="space-y-3">
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
                />

                {password && (
                  <div className="space-y-2 px-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-600">Password Strength</span>
                      <Badge label={strengthLabel.label} variant={strengthLabel.color} size="sm" />
                    </div>
                    <Progress value={strengthLabel.value} label={undefined} showValue={false} />
                    <p className="text-xs text-neutral-500">
                      💡 Mix uppercase, lowercase, numbers & symbols for a stronger password
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
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

              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 accent-primary-600 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-neutral-600 cursor-pointer">
                  I agree to the{" "}
                  <Link href="#" className="text-primary-600 font-medium hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary-600 font-medium hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={loading}
                className="mt-6"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Already a member?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/login">
              <Button
                variant="outline"
                size="md"
                fullWidth
                type="button"
              >
                Sign In
              </Button>
            </Link>
          </CardBody>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600 mt-6">
          Free account • No credit card required • Start today
        </p>
      </div>
    </div>
  );
}
