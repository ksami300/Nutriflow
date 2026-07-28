"use client";

import { startTransition } from "react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[32px] border border-slate-200 p-8 shadow-xl text-center space-y-6">
        
        {/* 🚨 BRENDIRANI SIGURNOSNI SIMBOL */}
        <div className="mx-auto h-16 w-16 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center text-rose-600 text-2xl animate-bounce">
          ⚠️
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Sentry Štit Aktiviran</h2>
          <p className="text-sm text-slate-500">
            Aplikacija je uspešno presrela i izolovala mrežnu ili runtime anomaliju pre pada sistema.
          </p>
        </div>

        {/* 🔒 TEHNIČKI KONTEKST ZATVOREN ZA PRODUKCIJU */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Izveštaj anomalije:</p>
          <p className="text-xs font-mono text-rose-700 mt-1.5 break-all font-semibold">
            {error.message || "Udaljeni server u Frankfurtu nije odgovorio na vreme (Timeout)."}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Oporavak i re-renderovanje Next.js stanja */}
          <button
            onClick={() => startTransition(() => resetErrorBoundary())}
            className="w-full rounded-[24px] bg-emerald-600 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-600/10"
          >
            🔄 Pokušaj ponovo
          </button>
          
          <div className="text-[11px] text-slate-400 font-medium">
            Ukoliko se problem ponavlja, Erste/George premium DevOps korisnička podrška je obaveštena.
          </div>
        </div>

      </div>
    </div>
  );
}
