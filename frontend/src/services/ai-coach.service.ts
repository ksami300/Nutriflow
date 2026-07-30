export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class AiCoachService {
  private static readonly API_BASE = "http://localhost:5000/api/ai";

  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`
    };
  }

  /**
   * 🤖 SLANJE UPITA KORISNIKA KA AI NUTRICIONISTIČKOM EKSPERTU
   */
  static async sendMessage(history: ChatMessage[]): Promise<{ success: boolean; reply?: string; message?: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/coach`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ messages: history })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "AI podsistem trenutno ne odgovara");
      return { success: true, reply: result.data.reply };
    } catch (error: any) {
      console.error("🚨 [AI COACH SERVICE ERROR]:", error);
      return { success: false, message: error.message || "Greška pri uspostavljanju veze sa AI modelom" };
    }
  }
}
