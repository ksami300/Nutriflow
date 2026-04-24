"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  // ✅ TEST API
  useEffect(() => {
    const testAPI = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/test`
        );

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        setMessage("API error ❌");
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  // ✅ STRIPE UPGRADE (ISPRAVNO MESTO)
  const handleUpgrade = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Payment error ❌");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">

      {/* HERO */}
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-bold mb-4">
          NutriFlow 🚀
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          AI generiše personalizovan plan ishrane za tebe u sekundama.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 justify-center">

          <Link href="/login">
            <button className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition">
              Login
            </button>
          </Link>

          <Link href="/generate-plan">
            <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:opacity-90 transition">
              Generate Plan
            </button>
          </Link>

          <Link href="/history">
            <button className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:opacity-90 transition">
              History
            </button>
          </Link>

          {/* 🔥 PREMIUM BUTTON */}
          <button
            onClick={handleUpgrade}
            className="px-6 py-3 bg-yellow-500 text-black rounded-xl hover:opacity-90 transition"
          >
            Upgrade 🚀
          </button>

        </div>
      </div>

      {/* STATUS */}
      <div className="mt-10 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Backend status
        </h2>

        <p className="text-lg font-bold">
          {loading ? "Učitavanje..." : message}
        </p>
      </div>

    </div>
  );
}