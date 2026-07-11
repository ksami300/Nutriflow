"use client";

import { useEffect, useState } from "react";

const goalOptions = [
  { value: "lose weight", label: "Lose Weight" },
  { value: "gain muscle", label: "Gain Muscle" },
  { value: "maintain", label: "Maintain" },
];

const dietTypeOptions = [
  { value: "standard", label: "Standard" },
  { value: "keto", label: "Keto" },
  { value: "vegan", label: "Vegan" },
  { value: "high-protein", label: "High Protein" },
];

const sampleMeals = {
  standard: ["Oatmeal with berries and nuts", "Grilled chicken salad", "Salmon with quinoa and vegetables"],
  keto: ["Avocado eggs", "Tuna salad with olive oil", "Steak with broccoli"],
  vegan: ["Smoothie bowl with fruits", "Chickpea salad", "Lentil curry with rice"],
  "high-protein": ["Greek yogurt with protein", "Turkey wrap", "Chicken stir fry"],
};

export default function InteractivePlanDemo() {
  const [goal, setGoal] = useState("lose weight");
  const [weight, setWeight] = useState(70);
  const [dietType, setDietType] = useState("standard");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const messages = [
      "Analyzing your body...",
      "Calculating optimal calories...",
      "Building your meal plan...",
    ];

    let index = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[index]);
      index += 1;
      if (index >= messages.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          setShowPreview(true);
        }, 500);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = () => {
    setShowPreview(false);
    setIsLoading(true);
  };

  const calories = goal === "lose weight" ? 1800 : goal === "gain muscle" ? 2500 : 2200;
  const meals = sampleMeals[dietType as keyof typeof sampleMeals] || sampleMeals.standard;

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Instant demo</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Preview your smart nutrition plan
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Your Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Weight (kg)</label>
          <input
            type="number"
            inputMode="numeric"
            min={40}
            max={200}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Diet Preference</label>
          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            {dietTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-[28px] bg-emerald-600 px-6 py-4 text-base font-semibold text-white transition duration-200 hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-200"
      >
        {isLoading ? "Generating..." : "Generate Preview"}
      </button>

      {isLoading && (
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-center text-slate-600 shadow-sm shadow-slate-200/60">
          <p className="font-semibold text-slate-900">{loadingMessage}</p>
          <p className="mt-2 text-sm">Preparing your plan preview for mobile and desktop.</p>
        </div>
      )}

      {showPreview && (
        <div className="mt-6 space-y-6">
          <div className="rounded-[28px] bg-emerald-50 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-700">Estimated Daily Calories</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{calories} kcal</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {meals.map((meal) => (
              <div key={meal} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
                <p className="font-semibold text-slate-950">{meal}</p>
                <p className="mt-2 text-sm text-slate-600">Balanced macros optimized for {goal}.</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
