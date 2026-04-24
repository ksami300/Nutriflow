"use client";

import { useState } from "react";

export default function GeneratePlanPage() {
  const [form, setForm] = useState({
    goal: "gain",
    weight: "",
    height: "",
    activity: "moderate",
  });

  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const generatePlan = async () => {
    setLoading(true);

    const res = await fetch(`${API}/api/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  };

  const savePlan = async () => {
    await fetch(`${API}/api/save-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    alert("✅ Plan saved!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">

      <h1 className="text-3xl font-bold">🧠 Generate Plan</h1>

      <select onChange={(e) => setForm({ ...form, goal: e.target.value })}>
        <option value="gain">Gain</option>
        <option value="lose">Lose</option>
      </select>

      <input placeholder="Weight" onChange={(e) => setForm({ ...form, weight: e.target.value })} />
      <input placeholder="Height" onChange={(e) => setForm({ ...form, height: e.target.value })} />

      <select onChange={(e) => setForm({ ...form, activity: e.target.value })}>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>

      <button onClick={generatePlan}>
        {loading ? "Generating..." : "Generate 🚀"}
      </button>

      {plan && (
        <div className="bg-white p-4 rounded shadow">
          <pre>{plan}</pre>

          <button onClick={savePlan} className="mt-4 bg-green-500 text-white px-4 py-2">
            Save Plan 💾
          </button>
        </div>
      )}

    </div>
  );
}