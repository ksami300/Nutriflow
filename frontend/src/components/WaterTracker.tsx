"use client";

import { useState, useEffect } from "react";
import { WaterTrackerService, WaterLogResponse } from "@/services/water-tracker.service";
import { ErrorBoundaryService } from "@/services/error-boundary.service";

export default function WaterTracker() {
  const [dailyLogs, setDailyLogs] = useState<WaterLogResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dailyGoalMl = 2500;

  // Izračunavanje ukupnog unosa vode za tekući dan
  const totalDrunkMl = dailyLogs.reduce((sum, log) => sum + log.amountMl, 0);
  const progressPercentage = Math.min(Math.round((totalDrunkMl / dailyGoalMl) * 100), 100);

  useEffect(() => {
    async function loadHydrationData() {
      const data = await WaterTrackerService.getDailyLog();
      setDailyLogs(data);
    }
    loadHydrationData();
  }, []);

  const handleAddWater = async (amountMl: number) => {
    setLoading(true);
    try {
      const result = await WaterTrackerService.logWater(amountMl);
      if (result.success && result.data) {
        setDailyLogs((prev) => [...prev, result.data!]);
        ErrorBoundaryService.handleSuccess(`💧 Uspešno zabeleženo unetih ${amountMl}ml vode!`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      ErrorBoundaryService.handleHttpError(error, "Neuspešan upis unosa tečnosti");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 text-white shadow-xl">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Praćenje hidracije</h3>
          <p className="text-xs text-slate-400 mt-0.5">Dnevni cilj optimizacije: {dailyGoalMl} ml</p>
        </div>
        <span className="text-2xl font-black text-blue-400">{totalDrunkMl} / {dailyGoalMl} ml</span>
      </div>

      {/* GRAFIČKI PROGRES BAR SA GLATKOM TRANZICIJOM */}
      <div className="w-full bg-slate-950 rounded-full h-4 border border-slate-800 overflow-hidden relative">
        <div
          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
        <span>Progres: {progressPercentage}%</span>
        <span>Preostalo: {Math.max(dailyGoalMl - totalDrunkMl, 0)} ml</span>
      </div>

      {/* KONTROLNA BRZA DUGMAD ZA UNOS TEČNOSTI */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleAddWater(250)}
          disabled={loading}
          className="py-3 px-4 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl font-bold text-sm text-blue-400 transition-all active:scale-95 disabled:opacity-50"
        >
          ➕ 250 ml
        </button>
        <button
          onClick={() => handleAddWater(500)}
          disabled={loading}
          className="py-3 px-4 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl font-bold text-sm text-blue-400 transition-all active:scale-95 disabled:opacity-50"
        >
          ➕ 500 ml
        </button>
        <button
          onClick={() => handleAddWater(750)}
          disabled={loading}
          className="py-3 px-4 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl font-bold text-sm text-blue-400 transition-all active:scale-95 disabled:opacity-50"
        >
          ➕ 750 ml
        </button>
      </div>
    </div>
  );
}
