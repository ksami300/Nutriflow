export interface MealPlanMetrics {
  weight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
  goal: 'LOSE' | 'MAINTAIN' | 'GAIN';
}

export interface MealPlanResponse {
  id: string;
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  createdAt: string;
}

export class MealPlanService {
  private static readonly API_BASE = "http://localhost:5000/api/meal-plans";

  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`
    };
  }

  /**
   * 🥦 GENERISANJE NOVOG PLANA ISHRANE PREKO MIFFLIN-ST JEOR INFRASTRUKTURE
   */
  static async generateMealPlan(metrics: MealPlanMetrics): Promise<{ success: boolean; data?: MealPlanResponse; message?: string }> {
    try {
      const response = await fetch(`${this.API_BASE}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(metrics)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Generisanje plana ishrane zatrokiralo");
      return { success: true, data: result.data };
    } catch (error: any) {
      console.error("🚨 [MEAL PLAN SERVICE GENERATE ERROR]:", error);
      return { success: false, message: error.message || "Sistemska greška pri upisu u registre baze" };
    }
  }

  /**
   * 📥 PREUZIMANJE SVIH KORISNIČKIH PLANOVA ISHRANE IZ CENTRALNE MONGO BAZE
   */
  static async getUserMealPlans(): Promise<MealPlanResponse[]> {
    try {
      const response = await fetch(`${this.API_BASE}`, {
        method: "GET",
        headers: this.getHeaders()
      });

      if (!response.ok) throw new Error("Neuspešno povlačenje istorije planova");
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("🚨 [MEAL PLAN SERVICE GET ALL ERROR]:", error);
      return [];
    }
  }
}
