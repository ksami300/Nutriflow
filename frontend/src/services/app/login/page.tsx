"use client";

import { useEffect, useState } from "react";
import { getMealPlans, createMealPlan } from "@/services/api";
import { getToken, logout } from "@/utils/auth";
import AuthGuard from "@/components/AuthGuard";

export default function Dashboard() {
  const [plans, setPlans] = useState<any[]>([]);

  const token = getToken();

  const loadPlans = async () => {
    const data = await getMealPlans(token!);
    setPlans(data);
  };

  const handleGenerate = async () => {
    await createMealPlan("lose", token!);
    loadPlans();
  };

  useEffect(() => {
    if (token) loadPlans();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 p-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">NutriFlow</h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* ACTION */}
        <button
          onClick={handleGenerate}
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700"
        >
          Generiši plan
        </button>

        {/* PLANS */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <p className="font-semibold">Goal: {plan.goal}</p>
              <p>Calories: {plan.calories}</p>

              <div className="mt-2">
                {plan.meals.map((meal: any, i: number) => (
                  <div key={i} className="text-sm">
                    🍽 {meal.name} — {meal.calories} kcal
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </AuthGuard>
  );
}