"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nutriflow_history";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">📜 History</h1>

        {history.length === 0 ? (
          <p className="text-sm text-slate-600">You have no saved plans yet. Generate one first.</p>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="mb-2 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</div>
                <pre className="whitespace-pre-wrap text-sm leading-6">{entry.plan}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
