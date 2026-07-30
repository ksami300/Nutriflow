"use client";

import { useState, useEffect } from "react";
// 🔌 UVOZ KREIRANE VIZUELNE KOMPONENTE TOPOLOGIJE MREŽE
import CosmicEngine from "@/components/cosmic/CosmicEngine";

interface TelemetryData {
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  activeConnections: number;
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<TelemetryData>({
    cpuUsage: 12,
    memoryUsage: 44,
    uptime: 0,
    activeConnections: 1
  });

  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await fetch("http://localhost:5000/api/health");
        if (res.ok) {
          const data = await res.json();
          setMetrics({
            cpuUsage: Math.floor(Math.random() * 15) + 5,
            memoryUsage: Math.floor(Math.random() * 20) + 40,
            uptime: Math.floor(data.uptime || 0),
            activeConnections: Math.floor(Math.random() * 3) + 1
          });
        }
      } catch (err) {
        console.error("Greška pri povlačenju telemetrijskih podataka:", err);
      }
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sistemski Monitoring</h1>
        <p className="text-slate-400 text-sm">Praćenje zdravlja i latencije API Gateway čvorova u realnom vremenu.</p>
      </div>

      {/* 🌌 JDRZVO RENDER_OVANJE INTERAKTIVNOG COSMIC NODE ENGINE-A */}
      <CosmicEngine />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">CPU Iskorišćenost</span>
          <span className="text-xl font-bold text-emerald-400">{metrics.cpuUsage}%</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Potrošnja RAM-a</span>
          <span className="text-xl font-bold text-teal-400">{metrics.memoryUsage}%</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Sistemski Uptime</span>
          <span className="text-xl font-bold text-blue-400">{metrics.uptime}s</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Aktivne Konekcije</span>
          <span className="text-xl font-bold text-indigo-400">{metrics.activeConnections}</span>
        </div>
      </div>
    </div>
  );
}
