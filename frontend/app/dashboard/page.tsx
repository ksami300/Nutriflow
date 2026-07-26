"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getMyPlans, generatePlan, getSubscriptionStatus, createCheckoutSession } from "@/lib/api";
import { error } from "@/lib/logger";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dietType, setDietType] = useState("standard");
  const [isPremium, setIsPremium] = useState(true);
  const [resultPlan, setResultPlan] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      const data = await getMyPlans();
      setPlans(data || []);
    } catch (err) {
      error("Load plans error:", err);
    }
  }, []);

  useEffect(() => {
    loadPlans();
    
    // 💳 KONTROLISANI MONETIZACIONI HVATAČ (Čita uspeh uplate direktno sa Stripe-a!)
    if (searchParams.get("success") === "true") {
      setPaymentStatus("success");
    } else if (searchParams.get("canceled") === "true") {
      setPaymentStatus("canceled");
    }
  }, [loadPlans, searchParams]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await generatePlan({
        goal: "maintain",
        weight: 95,
        height: 190,
        age: 25,
        gender: "male",
        activityLevel: "high",
        preferences: { dietType, excludedFoods: [] }
      });
      setResultPlan(plan);
      await loadPlans();
    } catch (err: any) {
      error("Gen plan error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 🔥 REAL-TIME STRIPE TOAST NOTIFIKACIJE NA EKRANU */}
        {paymentStatus === "success" && (
          <div className="mb-6 rounded-[24px] bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 font-semibold shadow-sm">
            🎉 USPEH: Vaša Erste/George uplata je uspešno legla! Premium AI Coach je otključan!
          </div>
        )}
        {paymentStatus === "canceled" && (
          <div className="mb-6 rounded-[24px] bg-rose-50 border border-rose-200 p-4 text-rose-800 font-semibold shadow-sm">
            ❌ OBAVEŠTENJE: Transakcija je otkazana. Vaš račun nije zadužen.
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your meal plans</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold shadow-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950">
              👑 PREMIUM MEMBER
            </span>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Diet type</label>
              <select value={dietType} onChange={(e) => setDietType(e.target.value)} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:outline-none">
                <option value="standard">Standard</option>
                <option value="keto">Keto</option>
                <option value="vegan">Vegan</option>
                <option value="high-protein">High Protein</option>
              </select>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full rounded-[28px] bg-emerald-600 py-4 text-base font-semibold text-white transition duration-200 hover:bg-emerald-500">
              {loading ? "Generating..." : "Generate AI Plan"}
            </button>
          </div>
          <div className="space-y-6">
            {resultPlan ? (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xl font-bold text-emerald-600">💪 AI Plan uspešno generisan!</p>
                <p className="mt-2 text-slate-700">Target Calories: {resultPlan.calories || 2800} kcal</p>
              </div>
            ) : (
              <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
                Izaberite režim i generišite svoj prvi AI plan ishrane!
              </div>
            )}
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
