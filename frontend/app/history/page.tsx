"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nutriflow_history";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)]">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">History</p>
            <h1 className="text-3xl font-semibold text-white">Saved meal plans</h1>
            <p className="text-slate-400">Review your last recommendations anytime in one clean, mobile-ready list.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-700 bg-slate-900/80 p-6 text-center text-slate-400">
            You have no saved plans yet. Generate one to store your personalized nutrition history.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{entry.goal}</p>
                    <p className="mt-1 text-sm text-slate-300">{entry.weight}kg · {entry.height}cm · {entry.activity.replace("_", " ")}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm leading-6 text-slate-300 whitespace-pre-wrap">
                  {entry.plan}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
