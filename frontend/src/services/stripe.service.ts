export interface SubscriptionDetails {
  active: boolean;
  plan: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  expiresAt: string | null;
}

export class StripeService {
  private static readonly API_BASE = "http://localhost:5000/api/admin";

  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`
    };
  }

  /**
   * 💸 KREIRANJE STRIPE CHECKOUT SESIJE (Erste/George Platni Kanal)
   */
  static async createCheckoutSession(priceId: string): Promise<{ success: boolean; url: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/checkout/session`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ priceId })
      });

      if (!response.ok) throw new Error("Stripe sesija alokacije zatrokirala");
      return await response.json();
    } catch (error) {
      console.error("🚨 [STRIPE SERVICE CHECKOUT ERROR]:", error);
      return { success: false, url: "#" };
    }
  }

  /**
   * 📊 PREUZIMANJE LIVE STATUS_A KORISNIČKE PRETPLATE
   */
  static async getSubscriptionStatus(): Promise<SubscriptionDetails> {
    try {
      const response = await fetch(`${this.API_BASE}/metrics/summary`, {
        method: "GET",
        headers: this.getHeaders()
      });

      if (!response.ok) throw new Error("Neuspešno povlačenje finansijskih registara");
      const result = await response.json();
      return result.data || { active: false, plan: 'FREE', expiresAt: null };
    } catch (error) {
      console.error("🚨 [STRIPE SERVICE STATUS ERROR]:", error);
      return { active: false, plan: 'FREE', expiresAt: null };
    }
  }
}
