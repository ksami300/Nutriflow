"use client";

import { useEffect, useState } from "react";

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
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 font-mono tracking-widest animate-pulse">
          ⚡ INICIJALIZACIJA KOSMIČKIH MREŽNIH RELEJA...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 font-mono">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* 🌌 KOSMIČKO ZAGLAVLJE */}
        <div className="mb-8 rounded-[32px] border border-slate-800 bg-slate-900 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-xs text-emerald-500 animate-pulse">● Live Stream Cloud</div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">Infrastrukturni Svemir</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">NutriFlow Cosmic Node Engine</h1>
          <p className="mt-2 text-sm text-slate-400">Vizuelni prikaz povezanih planeta i satelita unutar AWS Frankfurt klastera.</p>
        </div>

        {/* 🪐 INTERAKTIVNA MAPA SVEMIRA (CSS Povezani čvorovi za odbranu rada!) */}
        <div className="mb-8 rounded-[32px] border border-slate-800 bg-slate-900/50 p-12 text-center relative min-h-[350px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          <div className="relative w-full max-w-lg flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* PLANETA 1: API GATEWAY */}
            <div className="z-10 bg-slate-950 p-6 rounded-full border-2 border-emerald-500 w-36 h-36 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse">
              <span className="text-2xl">⚡</span>
              <span className="text-xs font-bold mt-1">API Gateway</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Port 5000</span>
            </div>

            {/* SVETLOSNA LINIJA VEZE */}
            <div className="hidden md:block absolute top-1/2 left-24 right-24 h-0.5 bg-gradient-to-r from-emerald-500 via-purple-500 to-amber-500 animate-gradient -translate-y-1/2 z-0"></div>

            {/* PLANETA 2: REDIS WORKER (Satelit) */}
            <div className="z-10 bg-slate-950 p-6 rounded-full border-2 border-purple-500 w-36 h-36 flex flex-col items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-2xl">🐳</span>
              <span className="text-xs font-bold mt-1">BullMQ Redis</span>
              <span className="text-[10px] text-purple-400 font-bold mt-0.5">5 Threads</span>
            </div>

            {/* PLANETA 3: MAIN DATABASE */}
            <div className="z-10 bg-slate-950 p-6 rounded-full border-2 border-amber-500 w-36 h-36 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
              <span className="text-2xl">🪐</span>
              <span className="text-xs font-bold mt-1">MongoDB Core</span>
              <span className="text-[10px] text-amber-400 font-bold mt-0.5">{metrics.mealPlans} Docs</span>
            </div>

          </div>
        </div>

        {/* 📊 TELEMETRIJSKI PODACI */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider">System Pulse Uptime</p>
            <p className="text-xl font-bold mt-2 text-emerald-400 font-mono">{metrics.uptime}</p>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Active Memory Heap</p>
            <p className="text-xl font-bold mt-2 text-white font-mono">{metrics.memory}</p>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Active Users</p>
            <p className="text-xl font-bold mt-2 text-amber-400 font-mono">👥 {metrics.users} Accounts</p>
          </div>
        </div>

      </div>
    </div>
  );
}
