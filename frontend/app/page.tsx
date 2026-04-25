"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Checking backend...");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const testAPI = async () => {
      if (!apiUrl) {
        setMessage("NEXT_PUBLIC_API_URL is not configured.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/api/test`);

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        setMessage(data.message || "API working");
      } catch (error) {
        console.error(error);
        setMessage("API error ❌");
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, [apiUrl]);

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
    } catch (error) {
      console.error(error);
      alert("Payment error ❌");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-bold mb-4">NutriFlow 🚀</h1>

        <p className="text-lg text-gray-600 mb-6">
          AI generiše personalizovan plan ishrane za tebe u sekundama.
        </p>

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

          <button
            onClick={handleUpgrade}
            className="px-6 py-3 bg-yellow-500 text-black rounded-xl hover:opacity-90 transition"
          >
            Upgrade 🚀
          </button>
        </div>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-xl font-semibold mb-2">Backend status</h2>
        <p className="text-lg font-bold">{loading ? "Učitavanje..." : message}</p>
      </div>
    </div>
  );
}
