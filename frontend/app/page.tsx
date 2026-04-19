"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string>("");

  const testAPI = async () => {
    try {
      setResult("Loading... ⏳");

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        setResult("API URL nije definisan ❌");
        return;
      }

      console.log("API URL:", API_URL);

      const res = await fetch(`${API_URL}/api/test`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      setResult(data.msg || "Nema odgovora ❌");
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setResult("Greška sa API ❌");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">
        NutriFlow 🚀
      </h1>

      <p className="text-lg mb-6 text-center max-w-xl">
        AI generiše personalizovan plan ishrane za tebe u sekundama.
      </p>

      <button
        onClick={testAPI}
        className="bg-green-500 px-8 py-4 rounded-2xl text-black font-bold hover:scale-110 transition"
      >
        Test Backend
      </button>

      <p className="mt-8 text-xl text-center max-w-xl">
        {result}
      </p>
    </main>
  );
}