"use client";

import { useState } from "react";

export default function GeneratePlan() {
  const [form, setForm] = useState({
    goal: "",
    weight: "",
    height: "",
    activity: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generatePlan = async () => {
    if (!API_URL) return alert("API not set");

    setLoading(true);
    setResult("");

    try {
      const res = await fetch(`${API_URL}/api/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setResult(data.plan);

    } catch (err) {
      setResult("Error generating plan ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">

        <h1 className="text-2xl font-bold mb-2 text-center">
          Generate Nutrition Plan 🧠
        </h1>

        <p className="text-center text-gray-500 mb-6">
          AI će napraviti plan ishrane samo za tebe
        </p>

        <div className="space-y-4">
          <input name="goal" placeholder="Goal (lose/gain)" onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <input name="weight" placeholder="Weight (kg)" onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <input name="height" placeholder="Height (cm)" onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <input name="activity" placeholder="Activity level" onChange={handleChange} className="w-full p-3 border rounded-lg" />

          <button
            onClick={generatePlan}
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90"
          >
            {loading ? "Generating..." : "Generate Plan 🚀"}
          </button>
        </div>

        {loading && (
          <div className="mt-6 text-center text-gray-500">
            AI is generating your plan...
          </div>
        )}

        {result && (
          <div className="mt-6 bg-black text-green-400 p-4 rounded-lg whitespace-pre-wrap">
            {result}
          </div>
        )}

      </div>
    </div>
  );
}