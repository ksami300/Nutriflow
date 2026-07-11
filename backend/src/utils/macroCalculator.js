const validateInput = (value, name) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return parsed;
};

const calculateMacros = (calories, weight, goal) => {
  const totalCalories = validateInput(calories, "Calories");
  const kg = validateInput(weight, "Weight");

  let proteinPerKg = 2.0;
  let fatPerKg = 0.8;

  if (goal === "gain") {
    proteinPerKg = 2.2;
    fatPerKg = 1.0;
  } else if (goal === "lose") {
    proteinPerKg = 2.4;
    fatPerKg = 0.8;
  }

  const protein = Math.round(kg * proteinPerKg);
  let fat = Math.round(kg * fatPerKg);
  const proteinCalories = protein * 4;
  let fatCalories = fat * 9;

  let carbs = Math.round(Math.max((totalCalories - proteinCalories - fatCalories) / 4, 0));

  if (proteinCalories + fatCalories > totalCalories) {
    const availableCaloriesForFat = Math.max(totalCalories - proteinCalories, 0);
    fat = Math.round(availableCaloriesForFat / 9);
    fatCalories = fat * 9;
    carbs = 0;
  }

  return {
    protein,
    carbs,
    fat,
  };
};

module.exports = { calculateMacros };