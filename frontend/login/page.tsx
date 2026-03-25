"use client";

import { useEffect, useState } from "react";
import { getMealPlans, createMealPlan } from "@/services/api";
import { getToken, logout } from "@/utils/auth";
import toast from "react-hot-toast";

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
    } catch (err) {
      toast.error("Greška pri učitavanju planova");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await createMealPlan(goal, token!);
      toast.success("Plan kreiran 🔥");
      await loadPlans();
    } catch (err) {
      toast.error("Greška pri kreiranju plana");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* 🔴 OVO JE LOGOUT DUGME */}
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* SELECT GOAL */}
      <select
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border p-2 rounded mt-4"
      >
        <option value="lose">Mršavljenje</option>
        <option value="gain">Masa</option>
        <option value="maintain">Održavanje</option>
      </select>

      {/* GENERATE BUTTON */}
      <button
        onClick={handleGenerate}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Generiši plan
      </button>

      {/* LOADING */}
      {loading && <p className="mt-4">Loading...</p>}

      {/* PLANS */}
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
    </div>
  );
}