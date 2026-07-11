import jsPDF from "jspdf";

const formatNumber = (value) => Number(value || 0).toFixed(0);

const calculateWeeklySummary = (weeklyPlan) => {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
  let mealCount = 0;

  weeklyPlan.forEach((day) => {
    day.meals.forEach((meal) => {
      totals.calories += meal.totals?.calories || 0;
      totals.protein += meal.totals?.protein || 0;
      totals.carbs += meal.totals?.carbs || 0;
      totals.fat += meal.totals?.fat || 0;
      mealCount += 1;
    });
  });

  const days = weeklyPlan.length || 1;
  return {
    totalCalories: totals.calories,
    avgProtein: mealCount ? totals.protein / mealCount : 0,
    avgCarbs: mealCount ? totals.carbs / mealCount : 0,
    avgFat: mealCount ? totals.fat / mealCount : 0,
    totalMeals: mealCount,
    days,
  };
};

export const exportPlanToPDF = (plan) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const lineHeight = 7;

  const weeklyPlan =
    Array.isArray(plan.weeklyPlan) && plan.weeklyPlan.length
      ? plan.weeklyPlan
      : plan.meals
      ? [{ day: "Day 1", meals: plan.meals }]
      : [];

  const summary = calculateWeeklySummary(weeklyPlan);
  let y = 20;

  const addPageIfNeeded = (offset = 0) => {
    if (y + offset > 280) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NutriFlow Weekly Plan", margin, y);
  y += 10;

  doc.setDrawColor(200);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Weekly Summary`, margin, y);
  y += 8;

  doc.setFontSize(11);
  doc.text(`Days included: ${summary.days}`, margin, y);
  y += lineHeight;
  doc.text(`Total meals: ${summary.totalMeals}`, margin, y);
  y += lineHeight;
  doc.text(`Total calories: ${formatNumber(summary.totalCalories)} kcal`, margin, y);
  y += lineHeight;
  doc.text(`Average protein per meal: ${formatNumber(summary.avgProtein)} g`, margin, y);
  y += lineHeight;
  doc.text(`Average carbs per meal: ${formatNumber(summary.avgCarbs)} g`, margin, y);
  y += lineHeight;
  doc.text(`Average fat per meal: ${formatNumber(summary.avgFat)} g`, margin, y);
  y += 12;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  weeklyPlan.forEach((day, dayIndex) => {
    addPageIfNeeded(24);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(day.day, margin, y);
    y += 8;

    const dayTotals = day.meals.reduce(
      (acc, meal) => {
        acc.calories += meal.totals?.calories || 0;
        acc.protein += meal.totals?.protein || 0;
        acc.carbs += meal.totals?.carbs || 0;
        acc.fat += meal.totals?.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Day calories: ${formatNumber(dayTotals.calories)} kcal — P: ${formatNumber(dayTotals.protein)} g | C: ${formatNumber(dayTotals.carbs)} g | F: ${formatNumber(dayTotals.fat)} g`,
      margin,
      y
    );
    y += 8;

    day.meals.forEach((meal) => {
      addPageIfNeeded(18);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${meal.name} (${meal.type})`, margin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Totals: ${formatNumber(meal.totals?.calories)} kcal | P: ${formatNumber(meal.totals?.protein)} g | C: ${formatNumber(meal.totals?.carbs)} g | F: ${formatNumber(meal.totals?.fat)} g`,
        margin,
        y
      );
      y += 6;

      meal.foods.forEach((food) => {
        addPageIfNeeded(8);
        doc.text(
          `${food.name} — ${formatNumber(food.grams)} g | ${formatNumber(food.calories)} kcal | P: ${formatNumber(food.protein)} g | C: ${formatNumber(food.carbs)} g | F: ${formatNumber(food.fat)} g`,
          margin + 4,
          y
        );
        y += 6;
      });

      y += 6;
    });

    if (dayIndex < weeklyPlan.length - 1) {
      doc.setDrawColor(220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
    }
  });

  doc.save("nutriflow-weekly-plan.pdf");
};