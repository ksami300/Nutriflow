const { calculateCalories, calculateBMR, calculateTdee } = require("../src/utils/calorieCalculator");

describe("Calorie calculator", () => {
  test("calculates BMR for male correctly", () => {
    expect(calculateBMR({ gender: "male", weight: 80, height: 180, age: 30 })).toBeGreaterThan(1700);
  });

  test("calculates BMR for female correctly", () => {
    expect(calculateBMR({ gender: "female", weight: 65, height: 165, age: 28 })).toBeGreaterThan(1300);
  });

  test("calculates TDEE for moderate activity", () => {
    expect(calculateTdee({ gender: "male", weight: 80, height: 180, age: 30, activityLevel: "moderate" })).toBeGreaterThan(2000);
  });

  test("calculates calories for maintain goal", () => {
    const calories = calculateCalories({
      gender: "female",
      weight: 60,
      height: 165,
      age: 25,
      activityLevel: "light",
      goal: "maintain",
    });

    expect(calories).toBeGreaterThanOrEqual(1200);
  });

  test("does not return calories below safe threshold for weight loss", () => {
    const calories = calculateCalories({
      gender: "female",
      weight: 50,
      height: 160,
      age: 30,
      activityLevel: "sedentary",
      goal: "lose",
    });

    expect(calories).toBeGreaterThanOrEqual(1200);
  });

  test("throws on invalid activityLevel", () => {
    expect(() =>
      calculateCalories({
        gender: "male",
        weight: 80,
        height: 180,
        age: 30,
        activityLevel: "super-active",
        goal: "maintain",
      })
    ).toThrow("Invalid activity level");
  });
});
