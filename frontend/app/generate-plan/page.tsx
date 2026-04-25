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
  const [success, setSuccess] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [history, setHistory] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userId, setUserId] = useState("");
  const [userStatus, setUserStatus] = useState<any>(null);

  // Initialize user and load history
  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", id);
    }
    setUserId(id);

    // Load history
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setHistory(existing);

    // Fetch user status
    if (apiUrl && id) {
      fetchUserStatus(id);
    }
  }, [apiUrl]);

  const fetchUserStatus = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/user-status`, {
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

    return true;
  };

  const generatePlan = async () => {
    setError("");
    setSuccess(false);

    if (!apiUrl) {
      setError("API URL is not configured. Check NEXT_PUBLIC_API_URL");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

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
        throw new Error(data.error || "Failed to generate plan");
      }

      setPlan(data.plan);
      setSuccess(true);

      // Save to history
      const entry = {
        id: Date.now(),
        ...form,
        plan: data.plan,
        createdAt: new Date().toISOString(),
      };

      setHistory((prev) => {
        const updated = [entry, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // Refresh user status
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            🧠 Generate Your Plan
          </h1>
          <p className="text-gray-600">
            Get a personalized nutrition plan powered by AI
          </p>

          {userStatus && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {userStatus.isPremium ? "✨ Premium" : "📊 Free"}
              </span>
              {!userStatus.isPremium && (
                <span className="text-gray-600">
                  Plans used: {userStatus.count}/3
                </span>
              )}
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="grid gap-6 mb-8">
            {/* Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Goal
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.goal}
                onChange={(e) =>
                  setForm({ ...form, goal: e.target.value })
                }
              >
                <option value="gain">Gain Weight</option>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
              </select>
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⚖️ Weight (kg)
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="number"
                  placeholder="e.g., 75"
                  value={form.weight}
                  onChange={(e) =>
                    setForm({ ...form, weight: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📏 Height (cm)
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="number"
                  placeholder="e.g., 180"
                  value={form.height}
                  onChange={(e) =>
                    setForm({ ...form, height: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Activity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💪 Activity Level
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.activity}
                onChange={(e) =>
                  setForm({ ...form, activity: e.target.value })
                }
              >
                <option value="low">Low (sedentary)</option>
                <option value="moderate">Moderate (3-4 days/week)</option>
                <option value="high">High (5-6 days/week)</option>
                <option value="very_high">Very High (daily intense)</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ❌ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ Plan generated successfully!
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generatePlan}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Generating..." : "🚀 Generate Plan"}
            </button>

            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upgrading ? "⏳ Processing..." : "💳 Upgrade"}
            </button>
          </div>
        </div>

        {/* Generated Plan */}
        {plan && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">📋 Your Nutrition Plan</h2>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-slate-50 p-4 rounded-lg overflow-auto max-h-96">
              {plan}
            </pre>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">📜 History</h2>
            <div className="space-y-4 max-h-96 overflow-auto">
              {history.slice(0, 10).map((entry: any) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.goal?.toUpperCase()} • {entry.weight}kg • {entry.height}cm
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {entry.plan?.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}