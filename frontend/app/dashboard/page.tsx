"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPlans(data.plans || []);
        setIsPremium(data.isPremium || false);
      })
      .catch(() => alert("API error"))
      .finally(() => setLoading(false));
  }, []);

  const upgrade = async () => {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/upgrade-premium`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("You are now Premium!");
    setIsPremium(true);
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">NutriFlow AI</h1>

      {!isPremium && (
        <div className="mb-6 p-4 bg-yellow-500 text-black rounded-xl flex justify-between items-center">
          <span>🔒 Unlock full meal plans</span>
          <button
            onClick={upgrade}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Upgrade $4.99
          </button>
        </div>
      )}

      {plans.length === 0 && (
        <div>No plans yet.</div>
      )}

      {plans.map((plan, i) => (
        <div key={i} className="bg-gray-800 p-6 rounded-xl mb-6">
          <h2 className="text-2xl mb-2 capitalize">{plan.goal}</h2>
          <p className="text-gray-400">{plan.calories} kcal</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {plan.meals.map((meal: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  !isPremium && index > 1
                    ? "blur-sm bg-gray-700"
                    : "bg-gray-900"
                }`}
              >
                <h3 className="font-bold">{meal.category}</h3>
                <p>{meal.name}</p>
                <span className="text-sm text-gray-400">
                  {meal.calories} kcal
                </span>

                {!isPremium && index === 2 && (
                  <div className="mt-2 text-yellow-400">
                    🔒 Premium required
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}