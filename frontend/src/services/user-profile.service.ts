export interface UserHealthMetrics {
  weight: number;
  height: number;
  age: number;
  gender: "MALE" | "FEMALE";
  activityLevel: number;
  bmr: number;
  tdee: number;
}

export class UserProfileService {
  private static readonly API_BASE = "http://localhost:5000/api/users/profile";

  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`
    };
  }

  /**
   * 📊 AUTOMAT_SKA KALKULACIJA METRIKA (Mifflin-St Jeor + TDEE Algoritam)
   */
  static calculateMetrics(weight: number, height: number, age: number, gender: "MALE" | "FEMALE", activityLevel: number): { bmr: number; tdee: number } {
    // Mifflin-St Jeor BMR Baza
    const genderBonus = gender === "MALE" ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + genderBonus;
    
    // TDEE Multiplikacija na osnovu mrežnih koeficijenata aktivnosti
    const tdee = Math.round(bmr * activityLevel);
    return { bmr: Math.round(bmr), tdee };
  }

  /**
   * 🔒 UPDEJTOVANJE GLOBALNIH ZDRAVSTVENIH REGISTARA NA MONGO BAZI
   */
  static async updateMetrics(metrics: Omit<UserHealthMetrics, "bmr" | "tdee">): Promise<{ success: boolean; message?: string }> {
    try {
      const { bmr, tdee } = this.calculateMetrics(metrics.weight, metrics.height, metrics.age, metrics.gender, metrics.activityLevel);
      
      const payload: UserHealthMetrics = { ...metrics, bmr, tdee };

      const response = await fetch(`${this.API_BASE}/metrics`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Neuspešan upis metričkih podataka");
      return { success: true };
    } catch (error: any) {
      console.error("🚨 [USER PROFILE SERVICE UPDATE ERROR]:", error);
      return { success: false, message: error.message || "Sistemska greška pri upisu u registre baze" };
    }
  }
}
