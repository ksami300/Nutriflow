"use client";

import { useEffect, useState } from "react";
import { getMealPlans, createMealPlan } from "@/services/api";
import { getToken, logout } from "@/utils/auth";
import toast from "react-hot-toast";
import AICoach from "@/components/AICoach";

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

export default function Dashboard() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("lose");

  const token = getToken();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await getMealPlans(token!);
      setPlans(data);
    } catch {
      toast.error("Greška pri učitavanju");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAMO JEDAN handleBuy i VAN JSX
  const handleBuy = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      toast.error("Greška pri plaćanju");
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await createMealPlan(goal, token!);
      toast.success("Plan kreiran 🔥");
      await loadPlans();
    } catch {
      toast.error("Greška!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* GOAL */}
      <select
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border p-2 rounded mt-4"
      >
        <option value="lose">Mršavljenje</option>
        <option value="gain">Masa</option>
        <option value="maintain">Održavanje</option>
      </select>

      {/* GENERATE */}
      <button
        onClick={handleGenerate}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Generiši plan
      </button>

      {/* 💎 PREMIUM */}
      <button
        onClick={handleBuy}
        className="bg-purple-600 text-white px-4 py-2 mt-4 rounded"
      >
        Upgrade na Premium 💎
      </button>

      {/* LOADING */}
      {loading && <p className="mt-4">Loading...</p>}

      {/* PLANS */}
      <div className="mt-6 space-y-4">
        {plans.map((plan) => (
          <div key={plan._id} className="border p-4 rounded shadow">
            <p className="font-bold">Goal: {plan.goal}</p>
            <p>Calories: {plan.calories}</p>

            {plan.meals.map((meal, i) => (
              <p key={i}>
                {meal.name} - {meal.calories} kcal
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* 🤖 AI COACH */}
      <AICoach />

    </div>
  );
}