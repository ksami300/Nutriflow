"use client";

import { useState, useEffect } from "react";
import { MealPlanService, MealPlanResponse, MealPlanMetrics } from "@/services/meal-plan.service";
// 🔌 UVOZ NAŠE NOVE INTERAKTIVNE KOMPONENTE ZA HIDRACIJU
import WaterTracker from "@/components/WaterTracker";

export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<MealPlanResponse[]>([]);
  const [metrics, setMetrics] = useState<MealPlanMetrics>({
    weight: 80,
    height: 180,
    age: 25,
    gender: "MALE",
    activityLevel: 1.55,
    goal: "MAINTAIN"
  });

  useEffect(() => {
    async function loadData() {
      const history = await MealPlanService.getUserMealPlans();
      setPlans(history);
    }
    loadData();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await MealPlanService.generateMealPlan(metrics);
    if (result.success && result.data) {
      setPlans((prev) => [result.data!, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Meal Planning Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Generisanje personalizovanih planova ishrane i praćenje bio-metrika u realnom vremenu.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEVI RADNI PANEL (FORMULAR + VOD ZA HIDRACIJU) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* COMPONENT 1: INTERAKTIVNI CORES MEHANIZAM ZA UNOS VODE */}
            <WaterTracker />

            {/* FORMULAR ZA UNOS ZDRAVSTVENIH METRIKA */}
            <form onSubmit={handleGenerate} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-800 pb-2">Korisničke Metrike</h3>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">Težina (kg)</label>
                <input type="number" value={metrics.weight} onChange={(e) => setMetrics({...metrics, weight: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Visina (cm)</label>
                <input type="number" value={metrics.height} onChange={(e) => setMetrics({...metrics, height: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Starost (godine)</label>
                <input type="number" value={metrics.age} onChange={(e) => setMetrics({...metrics, age: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Pol</label>
                <select value={metrics.gender} onChange={(e) => setMetrics({...metrics, gender: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white">
                  <option value="MALE">Muški</option>
                  <option value="FEMALE">Ženski</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Cilj</label>
                <select value={metrics.goal} onChange={(e) => setMetrics({...metrics, goal: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white">
                  <option value="LOSE">Gubitak težine (Deficit)</option>
                  <option value="MAINTAIN">Održavanje kilaže</option>
                  <option value="GAIN">Izgradnja mišića (Suficit)</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl transition-all">
                {loading ? "Kalkulacija u toku..." : "🥦 Generiši plan ishrane"}
              </button>
            </form>
          </div>

          {/* PRIKAZ ISTORIJE PLANOVA ISHRANE */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold">Istorija tvojih planova ({plans.length})</h3>
            
            {plans.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                Nemate generisanih planova ishrane. Popunite metrike levo.
              </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-extrabold text-lg">{plan.calories} kcal</span>
                    <span className="text-xs text-slate-500">{new Date(plan.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-center text-slate-400">
                    <div className="bg-slate-950 p-2 rounded">🥣 Doručak: {plan.meals.breakfast?.join(", ") || "Uravnotežen obrok"}</div>
                    <div className="bg-slate-950 p-2 rounded">🥩 Ručak: {plan.meals.lunch?.join(", ") || "Proteinski obrok"}</div>
                    <div className="bg-slate-950 p-2 rounded">🥦 Večera: {plan.meals.dinner?.join(", ") || "Lagani obrok"}</div>
                    <div className="bg-slate-950 p-2 rounded">🍎 Užina: {plan.meals.snacks?.join(", ") || "Voće"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
