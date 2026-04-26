"use client";

import Link from "next/link";
import { Button } from "@/components/Button";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleUpgrade = async () => {
    if (!apiUrl) {
      alert("Upgrade not available because NEXT_PUBLIC_API_URL is missing.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Unable to start checkout.");
      }
    } catch {
      alert("Payment error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-md space-y-8">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-3xl bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
              <span>New</span>
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs">Mobile-first SaaS</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">NutriFlow</h1>
            <p className="text-slate-400 leading-7">
              AI-powered meal planning for modern users. Generate premium nutrition plans, save results, and upgrade for unlimited access.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <Link href="/generate-plan">
              <Button variant="primary" size="lg" fullWidth>
                Generate Plan
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" fullWidth>
                Sign In
              </Button>
            </Link>
            <button onClick={handleUpgrade} className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:opacity-95">
              Upgrade to Premium
            </button>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)]">
          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Why NutriFlow</p>
              <p className="mt-2 text-slate-200">Fast, clean meal plans designed for mobile users who want premium nutrition guidance in seconds.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: "Mobile-first", description: "No zooming, no horizontal scroll." },
                { title: "Dark UI", description: "Premium visuals built for modern SaaS." },
                { title: "AI Nutrition", description: "Personalized meal plans in one tap." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
