export interface WaterLogResponse {
  id: string;
  amountMl: number;
  createdAt: string;
}

export class WaterTrackerService {
  private static readonly API_BASE = "http://localhost:5000/api/water-tracker";

  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`
    };
  }

  /**
   * 💧 UPIS UNOSA VODE U CENTRALNE REGISTRE
   */
  static async logWater(amountMl: number): Promise<{ success: boolean; data?: WaterLogResponse; message?: string }> {
    try {
      const response = await fetch(`${this.API_BASE}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ amountMl: Number(amountMl) })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Neuspešan upis hidracije");
      return { success: true, data: result.data };
    } catch (error: any) {
      console.error("🚨 [WATER TRACKER SERVICE LOG ERROR]:", error);
      return { success: false, message: error.message || "Sistemska greška pri mrežnom prenosu" };
    }
  }

  /**
   * 📥 PREUZIMANJE LIVE PODATAKA O DNEVNOJ HIDRACIJI
   */
  static async getDailyLog(): Promise<WaterLogResponse[]> {
    try {
      const response = await fetch(`${this.API_BASE}/daily`, {
        method: "GET",
        headers: this.getHeaders()
      });

      if (!response.ok) throw new Error("Neuspešno povlačenje hidracionih zapisa");
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("🚨 [WATER TRACKER SERVICE GET ERROR]:", error);
      return [];
    }
  }
}
