"use client";

import { useState, useEffect } from "react";
import { StripeService, SubscriptionDetails } from "@/services/stripe.service";

export default function BillingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);

  useEffect(() => {
    async function loadSubscription() {
      const status = await StripeService.getSubscriptionStatus();
      setSubscription(status);
    }
    loadSubscription();
  }, []);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    const result = await StripeService.createCheckoutSession(priceId);
    if (result.success && result.url !== "#") {
      window.location.href = result.url;
    } else {
      alert("🚨 Greška prilikom alociranja Stripe sesije na serveru.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finansijski Panel</h1>
        <p className="text-slate-400 text-sm">Upravljanje licencama, transakcijama i Erste/George platnim prstenovima.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Status Licence</span>
          <h2 className="text-xl font-black text-emerald-400">{subscription?.plan || "FREE PLAN"}</h2>
        </div>
        <div className="text-sm bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
          Status računa: <span className="font-semibold text-slate-200">{subscription?.active ? "✓ Aktivan" : "Istekao"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Premium SaaS Paket</h3>
            <p className="text-3xl font-black text-emerald-400">$19<span className="text-sm font-normal text-slate-500">/mesečno</span></p>
            <p className="text-xs text-slate-400">Idealan nivo za napredne korisnike koji zahtevaju neograničene AI kalkulacije.</p>
          </div>
          <button
            onClick={() => handleCheckout("price_premium_monthly")}
            disabled={loading || subscription?.plan === "PREMIUM"}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl transition-all"
          >
            {loading ? "Preusmeravanje..." : subscription?.plan === "PREMIUM" ? "Plan je Aktivan" : "💳 Nadogradi odmah"}
          </button>
        </div>
      </div>
    </div>
  );
}
