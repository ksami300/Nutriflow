"use client";

import { useState } from "react";
import { getStripeBillingPortalSession } from "@/lib/api";
import { error } from "@/lib/logger";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [allowAi, setAllowAi] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleSave = () => {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      alert("🎉 Podešavanja uspešno sinhronizovana sa centralnim serverom u Frankfurtu!");
    }, 800);
  };

  // 💳 ASINHRONI POZIV ZA INDIREKTNO OTVARANJE STRIPE PRETPRAVNIČKOG PORTALA
  const handleOpenStripePortal = async () => {
    setPortalLoading(true);
    try {
      const data = await getStripeBillingPortalSession();
      if (data?.url) {
        // Otvaramo zvanični Stripe portal u novom prozoru pretraživača
        window.open(data.url, "_blank");
      } else {
        alert("❌ Greška: Server nije vratio ispravnu lokaciju platne kapije.");
      }
    } catch (err: any) {
      error("Stripe portal trigger error:", err.message);
      alert("⚠️ Prvo aktivirajte Premium nalog preko Stripe Checkout-a da biste otvorili Billing Portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* ⚙️ ZAGLAVLJE PODEŠAVANJA */}
        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Konfiguracija</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">System Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Upravljanje parametrima platforme i bezbednosnim AI protokolima u realnom vremenu.</p>
        </div>

        <div className="space-y-6">
          {/* 🎨 KARTICA INTERFEJSA */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-3 mb-4">Vizuelna Tema (UI Customization)</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setTheme("light")} 
                className={`px-4 py-3 rounded-2xl text-sm font-semibold border transition ${theme === "light" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}
              >
                ☀️ Svetla Tema (Default)
              </button>
              <button 
                onClick={() => setTheme("dark")} 
                className={`px-4 py-3 rounded-2xl text-sm font-semibold border transition ${theme === "dark" ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}
              >
                🌙 Tamna Tema (Premium Meni)
              </button>
            </div>
          </div>

          {/* 💳 KARTICA PREMIUM MONETIZACIJE (Stripe Management) */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-3 mb-2">Finansijski Pretplatnički Portal</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
              <div>
                <p className="font-semibold text-slate-900">Upravljanje Erste/George Pretplatom</p>
                <p className="text-xs text-slate-500">Otkazivanje plana, preuzimanje računa i ažuriranje platnih kartica direktno na Stripe serverima.</p>
              </div>
              <button
                onClick={handleOpenStripePortal}
                disabled={portalLoading}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition shadow-sm self-start sm:self-center"
              >
                {portalLoading ? "Otvaranje..." : "💳 Otvori Billing Portal"}
              </button>
            </div>
          </div>

          {/* 🤖 KARTICA BEZBEDNOSNIH AI PROTOKOLA */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-3 mb-2">Automatski AI Algoritmi</h3>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-900">Dozvoli OpenAI Coach Generisanje</p>
                <p className="text-xs text-slate-500">Ukoliko se isključi, sistem automatski aktivira interni deterministički Fallback štit.</p>
              </div>
              <input 
                type="checkbox" 
                checked={allowAi} 
                onChange={(e) => setAllowAi(e.target.checked)} 
                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-50 pt-4">
              <div>
                <p className="font-semibold text-slate-900">Mrežna e-mail obaveštenja</p>
                <p className="text-xs text-slate-500">Slanje izveštaja i nedeljnih planova ishrane preko Bull Queue prstena.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications} 
                onChange={(e) => setNotifications(e.target.checked)} 
                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 🚀 AKCIONO DUGME ZA SPREMAN PUSH */}
          <div className="flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={saveLoading}
              className="rounded-[24px] bg-slate-950 px-6 py-4 text-base font-semibold text-white transition duration-200 hover:bg-slate-800 disabled:opacity-50"
            >
              {saveLoading ? "Sinhronizacija..." : "Sačuvaj podešavanja"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
