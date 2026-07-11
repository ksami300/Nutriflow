const PDFDocument = require("pdfkit");

exports.generatePDF = (plan, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=plan.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("NutriFlow Meal Plan", { align: "center" });

  doc.moveDown();

  const weeklyPlan =
    Array.isArray(plan.weeklyPlan) && plan.weeklyPlan.length
      ? plan.weeklyPlan
      : plan.meals
      ? [{ day: "Day 1", meals: plan.meals }]
      : [];

  weeklyPlan.forEach((day) => {
    doc.fontSize(14).text(day.day);
    day.meals.forEach((meal) => {
      doc.fontSize(12).text(`${meal.name} - ${meal.totals?.calories || 0} kcal`, {
        indent: 10,
      });
    });
    doc.moveDown();
  });

  doc.end();
};