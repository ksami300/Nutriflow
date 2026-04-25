"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nutriflow_history";

export default function GeneratePlanPage() {
  const [form, setForm] = useState({
    goal: "gain",
    weight: "",
    height: "",
    activity: "moderate",
  });

  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // USER ID
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    setPlan("");

    try {
      const res = await fetch(`${apiUrl}/api/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error");
      }

      setPlan(data.plan);

      // SAVE HISTORY
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [{ ...form, plan: data.plan }, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    const res = await fetch(`${apiUrl}/api/create-checkout-session`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Generate Plan</h1>

      <input placeholder="Weight" onChange={(e) => setForm({ ...form, weight: e.target.value })} />
      <input placeholder="Height" onChange={(e) => setForm({ ...form, height: e.target.value })} />

      <button onClick={generatePlan}>
        {loading ? "Loading..." : "Generate"}
      </button>

      <button onClick={handleUpgrade} style={{ marginLeft: "10px" }}>
        Upgrade 💳
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {plan && <pre>{plan}</pre>}
    </div>
  );
}