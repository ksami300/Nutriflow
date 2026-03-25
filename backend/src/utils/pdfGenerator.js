import PDFDocument from "pdfkit";

export const generatePDF = (plan, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=plan.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("NutriFlow Meal Plan", { align: "center" });

  doc.moveDown();

  plan.meals.forEach((meal) => {
    doc.text(`${meal.name} - ${meal.calories} kcal`);
  });

  doc.end();
};
router.get("/:id/pdf", protect, async (req, res) => {
  const plan = await MealPlan.findById(req.params.id);

  generatePDF(plan, res);
});