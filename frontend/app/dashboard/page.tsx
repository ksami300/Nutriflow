"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

  // Generate plan
  const generatePlan = async () => {
    const token = localStorage.getItem("token");

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
      toast.success("Plan generated!");
      setShowForm(false);
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

    try {
      const res = await fetch(`${API}/api/meal-plans/${planId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete plan");

      setPlans(plans.filter((p) => p._id !== planId));
      toast.success("Plan deleted!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error deleting plan";
      toast.error(message);
    }
  };

  // Upgrade
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
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            NutriFlow
          </h1>

          <div className="flex items-center gap-4">
            {isPremium && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                💎 Premium
              </span>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Premium CTA */}
        {!isPremium && (
          <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-8 shadow-lg">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">Unlock Premium Features</h2>
              <p className="text-blue-100 mb-6">
                Get detailed macro breakdowns, personalized meal suggestions for dietary restrictions, and unlimited meal plans.
              </p>
              <button
                onClick={upgrade}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                Upgrade to Premium (€9.99/month)
              </button>
            </div>
          </section>
        )}

        {/* Generate Plan Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition text-lg"
          >
            ⚡ Generate New Plan
          </button>
        ) : (
          <section className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create Your Meal Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Goal
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      height: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      age: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activityLevel: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="veryActive">Very Active</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={generatePlan}
                disabled={formLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {formLoading ? "Generating..." : "Generate Plan"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-slate-500 text-lg">
              {showForm ? "Generate your first plan..." : "No plans yet. Generate one to get started!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition relative overflow-hidden"
              >
                {/* Premium Lock */}
                {!isPremium && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-2xl mb-2">🔒</p>
                      <p className="font-semibold">Premium Only</p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className={`space-y-4 ${!isPremium ? "blur-sm" : ""}`}>
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                      {plan.goal}
                    </span>
                    <p className="text-sm text-slate-500 mt-2">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-3xl font-bold text-slate-900">
                      {plan.calories}
                      <span className="text-sm text-slate-500 ml-1">kcal</span>
                    </p>
                  </div>

                  {/* Macros */}
                  {isPremium && plan.protein ? (
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 p-3 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-slate-600">Protein</p>
                        <p className="font-bold text-lg">{plan.protein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-600">Carbs</p>
                        <p className="font-bold text-lg">{plan.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-600">Fats</p>
                        <p className="font-bold text-lg">{plan.fats}g</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 p-3 rounded-lg text-center text-slate-600 text-sm">
                      Upgrade to see detailed macros
                    </div>
                  )}

                  {/* Meals */}
                  {isPremium && (
                    <div className="space-y-2 border-t pt-4">
                      <p className="text-sm font-semibold text-slate-700">Meals:</p>
                      {plan.meals.map((meal, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-slate-600">{meal.name}</span>
                          <span className="font-medium">{meal.calories}kcal</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => deletePlan(plan._id)}
                    className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    Delete Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}