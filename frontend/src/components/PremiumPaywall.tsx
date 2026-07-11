"use client";

import React from "react";

interface PremiumPaywallProps {
  loading?: boolean;
  onStart?: () => void;
  className?: string;
}

const features = [
  "Weekly AI Meal Plans",
  "Smart Grocery List",
  "Unlimited Generations",
  "Personalized Nutrition (based on your history)",
  "PDF Export",
];

export default function PremiumPaywall({
  loading = false,
  onStart,
  className = "",
}: PremiumPaywallProps) {
  return (
    <section className={`mx-auto max-w-md px-4 ${className}`}>
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-100 to-transparent opacity-70" />
        <div className="relative">
          <div className="absolute right-4 top-4 inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20">
            Most Popular
          </div>

          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Premium Access
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Upgrade to Premium
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Unlock the full power of AI nutrition.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl bg-slate-50 p-6 sm:p-8">
            {features.map((feature) => (
              <div key={feature} className="flex gap-3 text-slate-700">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                  ✓
                </span>
                <span className="text-sm font-medium leading-6">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[22px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-7 text-white shadow-[0_20px_50px_rgba(16,185,129,0.22)]">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-100/90">
                  Monthly price
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">€9.99<span className="ml-1 text-base font-medium">/month</span></p>
              </div>

              <button
                type="button"
                onClick={onStart}
                disabled={loading}
                className="inline-flex min-w-[170px] items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Starting..." : "Start Premium"}
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-100/85">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
