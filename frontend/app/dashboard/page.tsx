"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import { getToken, logout } from "@/utils/auth";

interface Meal {
  name: string;
  calories: number;
  category: string;
}

interface MealPlan {
  _id: string;
  goal: string;
  calories: number;
  bmr: number;
  tdee: number;
  meals: Meal[];
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Form state
  const [goal, setGoal] = useState("maintain");
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("180");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("moderate");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Load meal plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/meal-plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch plans");

      const data = await res.json();
      setPlans(data.plans || []);
      setIsPremium(data.isPremium || false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/meal-plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          goal,
          weight: parseFloat(weight),
          height: parseFloat(height),
          age: parseFloat(age),
          gender,
          activityLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create plan");
      }

      toast.success("Meal plan generated successfully!");
      await fetchPlans();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate plan");
    } finally {
      setGenerating(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/meal-plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete plan");

      toast.success("Plan deleted");
      await fetchPlans();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete plan");
    }
  };

  const upgradePremium = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/payments/upgrade-premium`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Upgrade failed");

      toast.success("Upgraded to Premium!");
      setIsPremium(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upgrade failed");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                NutriFlow Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                {isPremium ? "✨ Premium Member" : "Free Plan"}
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Generate Plan</h2>
                <form onSubmit={generatePlan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Goal
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="lose">Lose Weight</option>
                      <option value="maintain">Maintain</option>
                      <option value="gain">Gain Muscle</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 rounded-lg"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Activity Level
                    </label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="w-full border border-slate-300 px-3 py-2 rounded-lg"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light (1-3x/week)</option>
                      <option value="moderate">Moderate (3-5x/week)</option>
                      <option value="active">Active (6-7x/week)</option>
                      <option value="veryActive">Very Active</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={generating || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {generating ? "Generating..." : "Generate Plan"}
                  </button>
                </form>

                {!isPremium && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900 font-medium mb-3">
                      Unlock unlimited plans
                    </p>
                    <button
                      onClick={upgradePremium}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Plans Section */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-6 animate-pulse"
                    >
                      <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-4 bg-slate-100 rounded" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : plans.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-5xl mb-4">🥗</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    No meal plans yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Create your first personalized meal plan using the form on the left
                  </p>
                  <button
                    onClick={() => document.querySelector("form")?.scrollIntoView()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {plans.map((plan) => (
                    <div key={plan._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-2xl font-bold text-white capitalize">
                              {plan.goal === "lose"
                                ? "Weight Loss"
                                : plan.goal === "gain"
                                ? "Muscle Gain"
                                : "Maintenance"}{" "}
                              Plan
                            </h3>
                            <p className="text-blue-100 text-sm">
                              Created {new Date(plan.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => deletePlan(plan._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-slate-600">Total Calories</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {plan.calories}
                            </p>
                          </div>
                          <div className="bg-cyan-50 p-4 rounded-lg">
                            <p className="text-sm text-slate-600">BMR</p>
                            <p className="text-2xl font-bold text-cyan-600">{plan.bmr}</p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-slate-600">TDEE</p>
                            <p className="text-2xl font-bold text-purple-600">{plan.tdee}</p>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <p className="text-sm text-slate-600">Meals</p>
                            <p className="text-2xl font-bold text-amber-600">
                              {plan.meals.length}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {plan.meals.map((meal, idx) => (
                            <div key={idx} className="border border-slate-200 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-slate-900 capitalize">
                                  {meal.category}
                                </h4>
                                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                  {meal.calories} kcal
                                </span>
                              </div>
                              <p className="text-slate-600 text-sm">{meal.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}