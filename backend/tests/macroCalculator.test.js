const { calculateMacros } = require("../src/utils/macroCalculator");

describe("Macro calculator", () => {
  test("calculates macros for maintain goal", () => {
    const macros = calculateMacros(2200, 75, "maintain");
    expect(macros.protein).toBeGreaterThan(0);
    expect(macros.fat).toBeGreaterThan(0);
    expect(macros.carbs).toBeGreaterThanOrEqual(0);
    expect(macros.carbs + macros.protein * 4 + macros.fat * 9).toBeLessThanOrEqual(2200);
  });

  test("calculates higher protein for weight loss", () => {
    const macros = calculateMacros(1800, 70, "lose");
    expect(macros.protein).toBeGreaterThanOrEqual(140);
    expect(macros.carbs).toBeGreaterThanOrEqual(0);
  });

  test("calculates balanced macros for weight gain", () => {
    const macros = calculateMacros(2800, 85, "gain");
    expect(macros.fat).toBeGreaterThanOrEqual(60);
    expect(macros.carbs).toBeGreaterThanOrEqual(0);
  });

  test("does not return negative carbs when calories are low", () => {
    const macros = calculateMacros(1000, 50, "lose");
    expect(macros.carbs).toBeGreaterThanOrEqual(0);
    expect(macros.fat).toBeGreaterThanOrEqual(0);
  });

  test("throws on invalid inputs", () => {
    expect(() => calculateMacros(-2000, 70, "maintain")).toThrow("Calories must be a positive number");
    expect(() => calculateMacros(2200, -70, "maintain")).toThrow("Weight must be a positive number");
  });
});
