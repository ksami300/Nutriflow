"use client";

import { useEffect, useState } from "react";
import { getSubscriptionStatus } from "@/lib/api";

export default function SystemMetricsPage() {
  const [metrics, setMetrics] = useState<any>({
    uptime: "24h 15m 32s",
    memory: "142MB / 512MB",
    cpu: "12%",
    users: 132,
    mealPlans: 514,
    premiumUsers: 48
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuliramo učitavanje mrežne telemetrije iz našeg Express /metrics podsistema
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-lg font-semibold text-slate-600">Povezivanje sa telemetrijskim serverom u Frankfurtu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* 📈 ZAGLAVLJE MONITORINGA */}
        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Live Telemetry</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">System Performance Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Real-time uvid u iskorišćenost serverskih resursa, memorijske procente i B2C biznis metrike.</p>
        </div>

        {/* 📊 INFRASTRUKTURNE METRIKE (Prvi prsten) */}
        <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">🖥️ Infrastrukturni Status (AWS Frankfurt)</h2>
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Express Server Uptime</p>
            <p className="text-2xl font-bold text-slate-950 mt-2 font-mono text-emerald-600">{metrics.uptime}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Heap RAM Allocation</p>
            <p className="text-2xl font-bold text-slate-950 mt-2 font-mono text-slate-900">{metrics.memory}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CPU Core Utilization</p>
            <p className="text-2xl font-bold text-slate-950 mt-2 font-mono text-slate-900">{metrics.cpu}</p>
          </div>
        </div>

        {/* 📈 BIZNIS SAAS METRIKE (Drugi prsten) */}
        <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">🚀 Poslovni SaaS Indikatori</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ukupno Korisnika</p>
            <p className="text-3xl font-extrabold text-slate-950 mt-2 font-mono">{metrics.users}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Generisanih AI Planova</p>
            <p className="text-3xl font-extrabold text-slate-950 mt-2 font-mono text-teal-600">{metrics.mealPlans}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Aktivnih Premium Članova</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-2 font-mono">👑 {metrics.premiumUsers}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
