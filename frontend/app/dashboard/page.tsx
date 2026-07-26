"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getMyPlans, generatePlan, deletePlan, getSubscriptionStatus, createCheckoutSession } from "@/lib/api";
import { error } from "@/lib/logger";

function DashboardContent() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dietType, setDietType] = useState("standard");
  const [excluded, setExcluded] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [resultPlan, setResultPlan] = useState(null);
  const searchParams = useSearchParams();

  const loadSubscription = useCallback(async () => {
    try {
      const res = await getSubscriptionStatus();
      setIsPremium(res?.isPremium ?? false);
    } catch (err) {
      error("Subscription error:", err);
      setIsPremium(false);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const data = await getMyPlans();
      setPlans(data || []);
    } catch (err) {
      error("Load plans:", err);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
    loadPlans();
  }, [loadSubscription, loadPlans]);

  const handleGenerate = async () => {
    if (!isPremium) return;
    setLoading(true);
    try {
      const plan = await generatePlan({
        goal: "maintain",
        weight: 80,
        height: 180,
        age: 25,
        gender: "male",
        activityLevel: "moderate",
        preferences: { dietType, excludedFoods: [] }
      });
      setResultPlan(plan);
      await loadPlans();
    } catch (err) {
      error("Gen plan error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await createCheckoutSession();
      if (res?.url) window.location.href = res.url;
    } catch (err) {
      error("Upgrade error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your meal plans</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold shadow-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950">
              PREMIUM MEMBER
            </span>
          </div>
        </div>
        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <button onClick={handleGenerate} disabled={loading} className="w-full rounded-[28px] bg-emerald-600 py-4 text-base font-semibold text-white">
              {loading ? "Generating..." : "Generate AI Plan"}
            </button>
          </div>
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              Ulogovani ste kao Premium clan. Izaberite rezim i generisite svoj prvi AI plan ishrane!
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
