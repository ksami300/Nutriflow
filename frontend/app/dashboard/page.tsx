"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input, Select } from "@/components/FormInputs";
import { Button, IconButton } from "@/components/Button";
import { Card, CardBody, CardHeader, CardTitle, CardDescription, EmptyState, Alert } from "@/components/Card";
import { Spinner, Badge, Progress, SkeletonText } from "@/components/UI";
import { SkeletonDashboard, SkeletonGrid, SkeletonCard } from "@/components/LoadingSkeleton";
import AICoach from "@/components/AICoach";

interface Meal {
  name: string;
  calories: number;
}

interface MealPlan {
  _id: string;
  goal: string;
  calories: number;
  bmr: number;
  tdee: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  meals: Meal[];
  createdAt: string;
}

export default function Dashboard() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    goal: "maintain",
    weight: 70,
    height: 175,
    age: 25,
    gender: "male",
    activityLevel: "moderate",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // Load plans on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    loadPlans(token);
  }, [router]);

  const loadPlans = async (token: string) => {
    try {
      const res = await fetch(`${API}/api/meal-plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch plans");

      const data = await res.json();
      setPlans(data.plans || []);
      setIsPremium(data.isPremium || false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error loading plans";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.weight < 30 || formData.weight > 300) {
      errors.weight = "Weight must be between 30 and 300 kg";
    }
    if (formData.height < 100 || formData.height > 250) {
      errors.height = "Height must be between 100 and 250 cm";
    }
    if (formData.age < 13 || formData.age > 120) {
      errors.age = "Age must be between 13 and 120";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate plan
  const generatePlan = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch(`${API}/api/meal-plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate plan");
      }

      const data = await res.json();
      setPlans([data.plan, ...plans]);
      toast.success("🎉 Meal plan generated successfully!");
      setShowForm(false);
      setFormErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error generating plan";
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete plan
  const deletePlan = async (planId: string) => {
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const res = await fetch(`${API}/api/meal-plans/${planId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete plan");

      setPlans(plans.filter((p) => p._id !== planId));
      toast.success("Plan deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error deleting plan";
      toast.error(message);
    }
  };

  // Upgrade to premium
  const upgrade = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/api/payments/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Stripe error");

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Stripe error";
      toast.error(message);
    }
  };

  // Logout
  const logout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  };

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      {/* HEADER */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-40 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🥗</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-light bg-clip-text text-transparent">
              NutriFlow
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isPremium && (
              <Badge
                label="💎 Premium Member"
                variant="success"
                size="md"
              />
            )}
            <IconButton
              variant="outline"
              size="md"
              onClick={logout}
              title="Logout"
            >
              🚪
            </IconButton>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Premium CTA */}
        {!isPremium && (
          <Alert
            type="info"
            title="✨ Unlock Premium Features"
            description="Get unlimited meal plans, detailed macro breakdowns, and personalized suggestions for dietary restrictions."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={upgrade}
              >
                Upgrade to Premium (€9.99/month)
              </Button>
            }
          />
        )}

        {/* Form Section */}
        {!showForm ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setShowForm(true)}
            className="h-16 text-lg font-bold"
          >
            ⚡ Generate New Meal Plan
          </Button>
        ) : (
          <Card variant="elevated" padded>
            <CardHeader>
              <CardTitle>Create Your Personalized Meal Plan</CardTitle>
              <CardDescription>Fill in your details and we'll calculate the perfect calorie target for you</CardDescription>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select
                  label="Goal"
                  options={[
                    { value: "lose", label: "Lose Weight" },
                    { value: "maintain", label: "Maintain Weight" },
                    { value: "gain", label: "Gain Weight" },
                  ]}
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  required
                />

                <Input
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                  error={formErrors.weight}
                  min="30"
                  max="300"
                  required
                  icon="⚖️"
                />

                <Input
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                  error={formErrors.height}
                  min="100"
                  max="250"
                  required
                  icon="📏"
                />

                <Input
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseFloat(e.target.value) })}
                  error={formErrors.age}
                  min="13"
                  max="120"
                  required
                  icon="🎂"
                />

                <Select
                  label="Gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                />

                <Select
                  label="Activity Level"
                  options={[
                    { value: "sedentary", label: "Sedentary (Little activity)" },
                    { value: "light", label: "Light (1-3 times/week)" },
                    { value: "moderate", label: "Moderate (3-5 times/week)" },
                    { value: "active", label: "Active (6-7 times/week)" },
                    { value: "veryActive", label: "Very Active (2x/day)" },
                  ]}
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={generatePlan}
                  isLoading={formLoading}
                >
                  Generate Plan
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Plans Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Your Meal Plans</h2>
            <p className="text-neutral-600 text-sm">
              {plans.length === 0
                ? "No plans yet"
                : `${plans.length} plan${plans.length !== 1 ? "s" : ""} created`}
            </p>
          </div>

          {plans.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No Meal Plans Yet"
              description="Create your first personalized meal plan using the form above"
              action={
                <Button
                  variant="primary"
                  onClick={() => setShowForm(true)}
                >
                  Create Plan
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <Card
                  key={plan._id}
                  variant="elevated"
                  hoverable
                  padded
                  className="relative min-h-full animate-slideUp"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Lock Overlay for Non-Premium */}
                  {!isPremium && plan.meals.length > 0 && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="text-center text-white">
                        <p className="text-3xl mb-2">🔒</p>
                        <p className="font-bold text-sm">Upgrade to view</p>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={`space-y-4 ${!isPremium && plan.meals.length > 0 ? "blur-sm" : ""}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Badge
                        label={`🎯 ${plan.goal.charAt(0).toUpperCase() + plan.goal.slice(1)}`}
                        variant="primary"
                        size="md"
                      />
                      <span className="text-xs text-neutral-500">
                        {new Date(plan.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Calories */}
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-600 font-medium">Daily Calories</p>
                      <p className="text-4xl font-bold text-primary-600">
                        {plan.calories}
                        <span className="text-base text-neutral-600 ml-2">kcal</span>
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg">
                      <div>
                        <p className="text-xs text-neutral-600 font-medium">BMR</p>
                        <p className="font-bold text-lg">{plan.bmr.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 font-medium">TDEE</p>
                        <p className="font-bold text-lg">{plan.tdee.toFixed(0)}</p>
                      </div>
                    </div>

                    {/* Macros */}
                    {isPremium && plan.protein ? (
                      <div className="space-y-3 pt-3 border-t border-neutral-200">
                        <p className="text-xs font-semibold text-neutral-700">Macronutrient Targets</p>
                        <div className="space-y-2">
                          <Progress
                            value={plan.protein}
                            max={200}
                            label={`Protein: ${plan.protein}g`}
                            showValue={false}
                          />
                          <Progress
                            value={plan.carbs || 0}
                            max={400}
                            label={`Carbs: ${plan.carbs}g`}
                            showValue={false}
                          />
                          <Progress
                            value={plan.fats || 0}
                            max={100}
                            label={`Fats: ${plan.fats}g`}
                            showValue={false}
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Meals */}
                    {isPremium && plan.meals.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-neutral-200">
                        <p className="text-xs font-semibold text-neutral-700">Meal Breakdown</p>
                        {plan.meals.map((meal, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-neutral-700">{meal.name}</span>
                            <Badge label={`${meal.calories}kcal`} variant="neutral" size="sm" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Delete Button */}
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      onClick={() => deletePlan(plan._id)}
                      className="mt-4"
                    >
                      Delete Plan
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* AI Coach */}
      <AICoach />
    </div>
  );
}
