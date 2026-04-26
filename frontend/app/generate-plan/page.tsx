"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "nutriflow_history";

function parsePlanSections(plan: string) {
  const lines = plan.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sections: { title: string; content: string[] }[] = [];
  let current = { title: "Plan", content: [] as string[] };

  for (const line of lines) {
    const match = line.match(/^(Breakfast|Lunch|Dinner|Snack|Meal)\s*[:\-]?\s*(.*)$/i);
    if (match) {
      if (current.content.length) {
        sections.push(current);
      }
      current = { title: match[1], content: [match[2] || ""] };
    } else {
      current.content.push(line);
    }
  }

  if (current.content.length) {
    sections.push(current);
  }

  return sections;
}

export default function GeneratePlanPage() {
  const [form, setForm] = useState({ goal: "gain", weight: "", height: "", activity: "moderate" });
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [userStatus, setUserStatus] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", id);
    }
    setUserId(id);

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setHistory(existing);

    if (apiUrl && id) {
      fetchUserStatus(id);
    }
  }, [apiUrl]);

  const fetchUserStatus = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/user-status`, {
        method: "GET",
        credentials: "include",
        headers: { "x-user-id": id },
      });
      if (res.ok) {
        const data = await res.json();
        setUserStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch user status:", err);
    }
  };

  const validateForm = () => {
    if (!form.weight || !form.height) {
      setError("Weight and height are required");
      return false;
    }

    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height);

    if (weight <= 0 || weight > 300) {
      setError("Weight must be between 1 and 300 kg");
      return false;
    }

    if (height <= 0 || height > 300) {
      setError("Height must be between 1 and 300 cm");
      return false;
    }

    setError("");
    return true;
  };

  const generatePlan = async () => {
    if (!apiUrl) {
      setError("API URL is not configured. Check NEXT_PUBLIC_API_URL");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/generate-plan`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      setPlan(data.plan);
      setSuccess(true);

      const entry = {
        id: Date.now(),
        ...form,
        plan: data.plan,
        createdAt: new Date().toISOString(),
      };
      const updated = [entry, ...history];
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      fetchUserStatus(userId);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Generate plan error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!apiUrl) {
      setError("API URL is not configured");
      return;
    }

    setUpgrading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ email: userStatus?.email || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      setError(err.message || "Payment error");
      console.error("Upgrade error:", err);
    } finally {
      setUpgrading(false);
    }
  };

  const planSections = useMemo(() => parsePlanSections(plan), [plan]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 overflow-x-hidden">
      <div className="mx-auto max-w-md px-2 space-y-6">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)]">
          <div className="mb-6 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
              AI powered plan
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white">Generate your plan</h1>
              <p className="mt-2 text-slate-400">Enter a few details and tap the CTA. Results appear immediately in premium cards.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-200">Goal</label>
              <select
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-4 text-base text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                autoComplete="off"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
              >
                <option value="gain">Gain Weight</option>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-200">Weight (kg)</label>
                <input
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-4 text-base text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="75"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-200">Height (cm)</label>
                <input
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-4 text-base text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="180"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-200">Activity level</label>
              <select
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-4 text-base text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                autoComplete="off"
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
              >
                <option value="low">Low (sedentary)</option>
                <option value="moderate">Moderate (3-4 days/week)</option>
                <option value="high">High (5-6 days/week)</option>
                <option value="very_high">Very High (daily intense)</option>
              </select>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                Plan generated successfully!
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={generatePlan}
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-5 py-4 text-sm font-semibold text-white shadow-xl transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Plan"}
              </button>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {upgrading ? "Processing..." : "Upgrade"}
              </button>
            </div>
          </div>
        </section>

        {plan && (
          <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your plan</p>
                <h2 className="text-2xl font-semibold text-white">Personalized meal cards</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="space-y-4">
              {planSections.length > 0 ? (
                planSections.map((section) => (
                  <div key={section.title} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Meal</span>
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-slate-300">
                      {section.content.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{plan}</pre>
                </div>
              )}
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)]">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-white">Recent plans</h2>
              <p className="mt-2 text-sm text-slate-400">Your last saved nutrition recommendations.</p>
            </div>
            <div className="space-y-4">
              {history.slice(0, 5).map((entry: any) => (
                <div key={entry.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                    <span>{entry.goal.toUpperCase()}</span>
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-300">{entry.weight} kg • {entry.height} cm • {entry.activity.replace("_", " ")}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400 overflow-hidden">{entry.plan}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
