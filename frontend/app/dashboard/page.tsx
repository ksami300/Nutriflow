"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Meal = {
  name: string;
  calories: number;
};

type Plan = {
  goal: string;
  calories: number;
  meals: Meal[];
};

export default function DashboardPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("gain");

  const generatePlan = () => {
    setLoading(true);

    setTimeout(() => {
      const generatedPlan: Plan = {
        goal,
        calories: 4800,
        meals: [
          { name: "Ovsene + whey + banana", calories: 900 },
          { name: "Piletina + pirinač + maslinovo ulje", calories: 1200 },
          { name: "Junetina + krompir", calories: 1300 },
          { name: "Jaja + hleb + sir", calories: 900 },
          { name: "Proteinski šejk + orašasti", calories: 500 }
        ]
      };

      setPlan(generatedPlan);
      setLoading(false);
      toast.success("AI plan generisan 🔥");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          NutriFlow AI 🔥
        </h1>

        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 mb-4"
        >
          <option value="lose">Fat Loss</option>
          <option value="gain">Muscle Gain</option>
          <option value="maintain">Maintain</option>
        </select>

        <button
          onClick={generatePlan}
          disabled={loading}
          className="w-full bg-green-500 py-3 rounded text-black font-bold"
        >
          {loading ? "Generating..." : "Generate AI Plan"}
        </button>

        {plan && (
          <div className="mt-6 space-y-3">
            <p className="text-xl font-bold">
              Calories: {plan.calories} kcal
            </p>

            {plan.meals.map((meal, i) => (
              <div key={i} className="bg-zinc-800 p-3 rounded">
                {meal.name} — {meal.calories} kcal
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}