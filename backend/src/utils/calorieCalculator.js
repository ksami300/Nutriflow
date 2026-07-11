const MIN_CALORIES = {
  male: 1500,
  female: 1200,
};

const activityMultiplier = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const assertValidNumber = (value, name) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return parsed;
};

const calculateBMR = ({ gender, weight, height, age }) => {
  const validatedWeight = assertValidNumber(weight, "Weight");
  const validatedHeight = assertValidNumber(height, "Height");
  const validatedAge = assertValidNumber(age, "Age");

  if (gender === "male") {
    return 10 * validatedWeight + 6.25 * validatedHeight - 5 * validatedAge + 5;
  }

  return 10 * validatedWeight + 6.25 * validatedHeight - 5 * validatedAge - 161;
};

const calculateTdee = ({ gender, weight, height, age, activityLevel }) => {
  const multiplier = activityMultiplier[activityLevel];
  if (!multiplier) {
    throw new Error(`Invalid activity level: ${activityLevel}`);
  }

  const bmr = calculateBMR({ gender, weight, height, age });
  return Math.round(bmr * multiplier);
};

const calculateCalories = ({ gender, weight, height, age, activityLevel, goal }) => {
  if (!['lose', 'gain', 'maintain'].includes(goal)) {
    throw new Error(`Invalid goal: ${goal}`);
  }

  const tdee = calculateTdee({ gender, weight, height, age, activityLevel });
  let calories = tdee;

  if (goal === "lose") {
    calories = Math.max(tdee - 500, MIN_CALORIES[gender] || 1200);
  } else if (goal === "gain") {
    calories = tdee + 500;
  }

  return Math.round(calories);
};

module.exports = { calculateCalories, calculateBMR, calculateTdee };