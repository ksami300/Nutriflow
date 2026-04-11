"use client";

import { useCallback, useEffect, useState } from "react";
import { getMealPlans, createMealPlan } from "@/services/api";
import { getToken, logout } from "@/utils/auth";
import toast from "react-hot-toast";
import AICoach from "@/components/AICoach";
import AuthGuard from "@/components/AuthGuard";

type Meal = {
  name: string;
  calories: number;
};

type Plan = {
  _id: string;
  goal: string;
  calories: number;
  meals: Meal[];
};

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("lose");

  const token = getToken();

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMealPlans(token!);
      setPlans(data);
    } catch {
      toast.error("Greška pri učitavanju planova");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadPlans();
  }, [token, loadPlans]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await createMealPlan(goal, token!);
      toast.success("Plan kreiran 🔥");
      await loadPlans();
    } catch {
      toast.error("Greška pri kreiranju plana");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Payment error");

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      toast.error("Greška pri plaćanju");
    }
  };

  return (
    <AuthGuard>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border p-2 rounded mt-4"
        >
          <option value="lose">Mršavljenje</option>
          <option value="gain">Masa</option>
          <option value="maintain">Održavanje</option>
        </select>

        <div className="mt-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Generiši plan
          </button>

          <button
            onClick={handleBuy}
            className="bg-purple-600 text-white px-4 py-2 mt-2 ml-2 rounded"
          >
            Buy Premium
          </button>
        </div>

        {loading && <p className="mt-4">Loading...</p>}

        <div className="mt-6 space-y-4">
          {plans.map((plan) => (
            <div key={plan._id} className="border p-4 rounded shadow">
              <p className="font-bold">Goal: {plan.goal}</p>
              <p>Calories: {plan.calories}</p>
              <div className="mt-2">
                {plan.meals.map((meal, i) => (
                  <p key={i}>
                    {meal.name} - {meal.calories} kcal
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AICoach />
      </div>
    </AuthGuard>
  );
}
