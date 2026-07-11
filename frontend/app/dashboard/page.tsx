"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getMyPlans,
  generatePlan,
  deletePlan,
  getGroceryList,
  sharePlan,
  createCheckoutSession,
  getSubscriptionStatus,
} from "@/lib/api";
import { exportPlanToPDF } from "@/utils/pdf";
import { error } from "@/lib/logger";

function DashboardContent() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dietType, setDietType] = useState("standard");
  const [excluded, setExcluded] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [groceryLists, setGroceryLists] = useState<Record<string, any[]>>({});
  const [groceryLoadingId, setGroceryLoadingId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [resultPlan, setResultPlan] = useState<any | null>(null);

  const searchParams = useSearchParams();

  const loadSubscription = useCallback(async () => {
    try {
      const res = await getSubscriptionStatus();
      setIsPremium(res?.isPremium ?? false);
      setStatusError(null);
    } catch (err) {
      error("Subscription error:", err);
      setStatusError("Unable to load subscription status.");
      setIsPremium(false);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const data = await getMyPlans();
      setPlans(data || []);
    } catch (err) {
      error("Load plans error:", err);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
    loadPlans();
  }, [loadSubscription, loadPlans]);

  useEffect(() => {
    if (searchParams?.get("success") === "true") {
      loadSubscription();
    }
  }, [searchParams, loadSubscription]);

  const handleGenerate = async () => {
    if (!isPremium) {
      return;
    }

    setLoading(true);

    try {
      const plan = await generatePlan({
        goal: "maintain",
        weight: 80,
        height: 180,
        age: 25,
        gender: "male",
        activityLevel: "moderate",
        preferences: {
          dietType,
          excludedFoods: excluded
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        },
      });

      setResultPlan(plan);
      await loadPlans();
    } catch (err) {
      error("Generate plan error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p._id !== id));
      setGroceryLists((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      error("Delete plan error:", err);
    }
  };

  const handleGenerateGroceries = async (planId: string) => {
    try {
      setGroceryLoadingId(planId);
      const data = await getGroceryList(planId);
      setGroceryLists((prev) => ({ ...prev, [planId]: data.groceries || [] }));
    } catch (err) {
      error("Generate grocery list error:", err);
    } finally {
      setGroceryLoadingId(null);
    }
  };

  const handleSharePlan = async (planId: string) => {
    try {
      const data = await sharePlan(planId);
      await navigator.clipboard.writeText(data.publicUrl);
      setCopiedLinkId(planId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (err) {
      error("Share plan error:", err);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await createCheckoutSession();
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      error("Upgrade error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your meal plans</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${isPremium ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
              {isPremium ? "PREMIUM USER" : "FREE USER"}
            </span>
            {statusError && <span className="text-sm font-medium text-red-600">{statusError}</span>}
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Diet type</label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value="standard">Standard</option>
                <option value="keto">Keto</option>
                <option value="vegan">Vegan</option>
                <option value="high-protein">High Protein</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Exclude foods</label>
              <input
                placeholder="rice, milk, soy..."
                value={excluded}
                onChange={(e) => setExcluded(e.target.value)}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !isPremium}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[28px] bg-emerald-600 px-5 py-4 text-base font-semibold text-white transition duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Generating..." : isPremium ? "Generate AI Plan" : "Premium Required"}
            </button>

            {!isPremium && (
              <button
                onClick={handleUpgrade}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[28px] bg-slate-950 px-5 py-4 text-base font-semibold text-white transition duration-200 hover:bg-slate-800"
              >
                Upgrade to Premium
              </button>
            )}
          </div>

          <div className="space-y-6">
            {resultPlan ? (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total Calories</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{resultPlan.calories} kcal</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total Protein</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{resultPlan.macros?.protein ?? 0} g</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-100 p-4 text-center">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Carbs</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{resultPlan.macros?.carbs ?? 0} g</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 p-4 text-center">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Fat</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{resultPlan.macros?.fat ?? 0} g</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 p-4 text-center">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Meals</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{resultPlan.weeklyPlan?.length ?? 0} days</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
                <p className="text-sm text-slate-600">No active plan yet. Upgrade to Premium and generate your first personalized weekly meal plan.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 space-y-6">
          {plans.map((plan) => {
            const weeklyPlan =
              Array.isArray(plan.weeklyPlan) && plan.weeklyPlan.length
                ? plan.weeklyPlan
                : plan.meals
                ? [{ day: "Day 1", meals: plan.meals }]
                : [];

            return (
              <div key={plan._id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{plan.goal}</p>
                    <p className="mt-1 text-sm text-slate-600">Generated on {new Date(plan.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => exportPlanToPDF(plan)}
                      className="min-h-[44px] rounded-[28px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={() => handleSharePlan(plan._id)}
                      className="min-h-[44px] rounded-[28px] bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-500"
                    >
                      {copiedLinkId === plan._id ? "Link Copied" : "Share Plan"}
                    </button>
                    <button
                      onClick={() => handleGenerateGroceries(plan._id)}
                      disabled={groceryLoadingId === plan._id}
                      className="min-h-[44px] rounded-[28px] bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {groceryLoadingId === plan._id ? "Loading..." : "Grocery List"}
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="min-h-[44px] rounded-[28px] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-slate-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {weeklyPlan.map((day: any) => (
                    <div key={day.day} className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{day.day}</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        {day.meals?.slice(0, 3).map((meal: any, mealIdx: number) => (
                          <div key={mealIdx}>
                            <p className="font-semibold text-slate-900">{meal.name}</p>
                            <p>{meal.foods?.map((food: any) => food.name).join(", ")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {groceryLists[plan._id] && groceryLists[plan._id].length > 0 && (
                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">Grocery List</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {groceryLists[plan._id].map((item: any, idx: number) => (
                        <li key={idx}>{item.name}: {item.totalGrams}g</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}


export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
