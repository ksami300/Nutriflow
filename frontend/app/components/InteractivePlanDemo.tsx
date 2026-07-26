"use client";

import { useEffect, useState } from "react";

const goalOptions = [
  { value: "lose weight", label: "Lose Weight (Definicija)" },
  { value: "gain muscle", label: "Gain Muscle (Masa/Suficit)" },
  { value: "maintain", label: "Maintain (Održavanje)" },
];

const dietTypeOptions = [
  { value: "standard", label: "Standardna ishrana" },
  { value: "keto", label: "Keto dijeta" },
  { value: "vegan", label: "Veganska ishrana" },
  { value: "high-protein", label: "Visoko-proteinska ishrana" },
];

const activityOptions = [
  { value: "1.2", label: "Sedentary (Bez aktivnosti, kancelarija)" },
  { value: "1.375", label: "Light (Laki trening 1-3 puta nedeljno)" },
  { value: "1.55", label: "Moderate (Jak trening 3-5 puta nedeljno)" },
  { value: "1.725", label: "Heavy (Težak trening 6-7 puta nedeljno)" },
  { value: "1.9", label: "Athlete (Ekstremni treninzi / Dupli program)" },
];

const sampleMeals = {
  standard: ["Oatmeal with berries and nuts", "Grilled chicken breast with rice & avocado", "Beef steak with sweet potato and asparagus"],
  keto: ["Avocado eggs with bacon", "Tuna salad with premium olive oil & seeds", "Ribeye steak with garlic broccoli"],
  vegan: ["Protein smoothie bowl with almond butter", "Chickpea & tofu Mediterranean salad", "Lentil curry with basmati rice"],
  "high-protein": ["Double Greek yogurt with protein scoop", "Turkey breast macro wrap", "Chicken breast stir-fry with egg whites"],
};

export default function InteractivePlanDemo() {
  const [goal, setGoal] = useState("gain muscle");
  const [weight, setWeight] = useState("96");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState("180");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [activity, setActivity] = useState("1.725");
  const [dietType, setDietType] = useState("high-protein");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const messages = [
      "Analyzing body metrics and metabolic rate...",
      "Applying sports activity multipliers...",
      "Formulating custom high-yield meal plan...",
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

  const cleanWeight = typeof weight === "string" ? weight.replace(",", ".") : weight;
  const numericWeight = Number(cleanWeight) || 0;
  const weightInKg = weightUnit === "lbs" ? numericWeight * 0.45359237 : numericWeight;

  const cleanHeight = typeof height === "string" ? height.replace(",", ".") : height;
  const numericHeight = Number(cleanHeight) || 0;
  const heightInCm = heightUnit === "inch" ? numericHeight * 2.54 : numericHeight;

  const activityMultiplier = Number(activity) || 1.2;

  const bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * 25) + 5;
  const tdee = bmr * activityMultiplier;
  
  const calories = Math.round(
    goal === "lose weight" 
      ? tdee - 500 
      : goal === "gain muscle" 
        ? tdee + 700 
        : tdee
  );

  const meals = sampleMeals[dietType as keyof typeof sampleMeals] || sampleMeals.standard;

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">🚀 PRO-BETA DEMO</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Preview your athletic nutrition plan
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
          <label className="mb-2 block text-sm font-medium text-slate-700">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            {activityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Weight</label>
            <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
              <button 
                type="button" 
                onClick={() => setWeightUnit("kg")} 
                className={`px-2 py-1 rounded-md font-semibold ${weightUnit === "kg" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >KG</button>
              <button 
                type="button" 
                onClick={() => setWeightUnit("lbs")} 
                className={`px-2 py-1 rounded-md font-semibold ${weightUnit === "lbs" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >LBS</button>
            </div>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={weightUnit === "kg" ? "e.g. 96" : "e.g. 211"}
            className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="mb-2 flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Height</label>
            <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
              <button 
                type="button" 
                onClick={() => setHeightUnit("cm")} 
                className={`px-2 py-1 rounded-md font-semibold ${heightUnit === "cm" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >CM</button>
              <button 
                type="button" 
                onClick={() => setHeightUnit("inch")} 
                className={`px-2 py-1 rounded-md font-semibold ${heightUnit === "inch" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >INCH</button>
            </div>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={heightUnit === "cm" ? "e.g. 180" : "e.g. 71"}
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
        {isLoading ? "Generating Athletic Plan..." : "Generate Pro Preview"}
      </button>

      {isLoading && (
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-center text-slate-600 shadow-sm shadow-slate-200/60">
          <p className="font-semibold text-slate-900">{loadingMessage}</p>
          <p className="mt-2 text-sm">Preparing high-yield performance plan for mobile and desktop.</p>
        </div>
      )}

      {showPreview && (
        <div className="mt-6 space-y-6">
          <div className="rounded-[28px] bg-emerald-50 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-700">Target Athletic Calories</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{calories > 1000 ? calories : 3500} kcal</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {meals.map((meal) => (
              <div key={meal} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
                <p className="font-semibold text-slate-950">{meal}</p>
                <p className="mt-2 text-sm text-slate-600">High-performance macro breakdown optimized for heavy loading.</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
