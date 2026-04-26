const OpenAI = require("openai");

class MealPlanService {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  // Calculate BMR using Mifflin-St Jeor
  calculateBMR(weight, height, age, gender) {
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Calculate TDEE
  calculateTDEE(bmr, activityLevel) {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  }

  // Generate demo plan (fallback)
  generateDemoPlan(calories) {
    return {
      breakfast: {
        name: "Oatmeal with Berries",
        calories: Math.round(calories * 0.25),
        protein: 15,
        carbs: 60,
        fat: 10,
      },
      lunch: {
        name: "Grilled Chicken Salad",
        calories: Math.round(calories * 0.3),
        protein: 40,
        carbs: 30,
        fat: 15,
      },
      dinner: {
        name: "Salmon with Quinoa",
        calories: Math.round(calories * 0.3),
        protein: 35,
        carbs: 40,
        fat: 20,
      },
      snacks: {
        name: "Greek Yogurt with Nuts",
        calories: Math.round(calories * 0.15),
        protein: 20,
        carbs: 20,
        fat: 15,
      },
    };
  }

  async generateMealPlan(userId, goals, preferences) {
    try {
      const { weight, height, age, gender, activityLevel, goal } = goals;

      // Validate inputs
      if (!weight || !height || !age || !gender || !activityLevel || !goal) {
        return {
          success: false,
          message: "Missing required fields: weight, height, age, gender, activityLevel, goal",
        };
      }

      // Calculate BMR and TDEE
      const bmr = this.calculateBMR(weight, height, age, gender);
      const tdee = this.calculateTDEE(bmr, activityLevel);

      // Adjust calories based on goal
      let targetCalories;
      if (goal === "lose") {
        targetCalories = tdee - 500;
      } else if (goal === "gain") {
        targetCalories = tdee + 500;
      } else {
        targetCalories = tdee;
      }

      // Ensure reasonable calorie range
      targetCalories = Math.max(1200, Math.min(4000, targetCalories));

      let mealPlan;
      let note = null;

      // If OpenAI not available, return demo plan
      if (!this.openai) {
        mealPlan = this.generateDemoPlan(targetCalories);
        note = "This is a demo plan. For personalized recommendations, ensure OPENAI_API_KEY is configured.";
      } else {
        // Call OpenAI API
        const prompt = `Generate a personalized meal plan for someone with these stats:
- Daily calories: ${targetCalories}
- Goal: ${goal} weight
- Gender: ${gender}
- Activity level: ${activityLevel}
- Dietary preferences: ${preferences || "No specific preferences"}

Please provide a realistic meal plan with breakfast, lunch, dinner, and snacks. Include approximate calories, protein, carbs, and fat for each meal. Make it practical and sustainable.`;

        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a professional nutritionist. Provide evidence-based meal plans." },
            { role: "user", content: prompt },
          ],
          max_tokens: 1000,
        });

        mealPlan = completion.choices[0].message.content;
      }

      return {
        success: true,
        mealPlan: {
          calories: targetCalories,
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          plan: mealPlan,
          note,
        },
      };
    } catch (error) {
      console.error("Meal plan generation error:", error);
      return {
        success: false,
        message: "Failed to generate meal plan",
      };
    }
  }
}

module.exports = new MealPlanService();