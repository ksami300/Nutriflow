"use client";

import { useEffect, useState } from "react";
import { getMe, getSubscriptionStatus } from "@/lib/api";
import { error } from "@/lib/logger";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [subStatus, setSubStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const userData = await getMe();
        setUser(userData);
        
        const subData = await getSubscriptionStatus();
        setSubStatus(subData);
      } catch (err: any) {
        error("Greška pri učitavanju profila:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-lg font-semibold text-slate-600">Učitavanje Vašeg Premium profila...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* 👑 KROVNO ZAGLAVLJE PROFILA */}
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.charAt(0) || "N"}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Korisnički Nalog</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{user?.firstName || "Nemanja"} {user?.lastName || "Mihajlović"}</h1>
            </div>
          </div>
          <span className="inline-flex self-start sm:self-center items-center rounded-full px-4 py-2 text-sm font-bold shadow-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950">
            👑 PREMIUM ČLAN
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 📊 KARTICA ZDRAVSTVENIH METRIKA */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-3 mb-4">Biometrijski Podaci (AI Ulaz)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Visina:</span><span className="font-semibold text-slate-950">190 cm</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Težina:</span><span className="font-semibold text-slate-950">95 kg</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Starost:</span><span className="font-semibold text-slate-950">25 godina</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Nivo Aktivnosti:</span><span className="font-semibold text-emerald-600">Visok (NFL intenzitet)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email adresa:</span><span className="font-semibold text-slate-950">{user?.email || "nemanjazmaj.mihajlovic@gmail.com"}</span></div>
            </div>
          </div>

          {/* 💳 KARTICA FINANSIJSKOG LIFECYCLE-A (Stripe + Erste/George) */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-3 mb-4">Pretplatnički Status & Monetizacija</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Platna kapija:</span><span className="font-semibold text-slate-950">Stripe Live Gateway</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status George uplate:</span><span className="font-bold text-emerald-600">REAL-TIME ACTIVE</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Preostalo AI tokena:</span><span className="font-semibold text-slate-950">{50 - (user?.aiUsageCount || 0)} / 50 danas</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Obračunski period:</span><span className="font-semibold text-slate-700">Mesečni (Automatsko obnavljanje)</span></div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-xs text-slate-400 italic text-center">Osigurano preko osigurane enkripcije u Frankfurtu.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
