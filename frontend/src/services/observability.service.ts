export interface QueueJobStatus {
  waiting: number;
  active: number;
  failed: number;
  completed: number;
}

export class ObservabilityService {
  private static readonly API_BASE = "http://localhost:5000/api/observability";

  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`
    };
  }

  /**
   * 🐳 POVLAČENJE METRIKA RADNIH REDOVA (BullMQ + Redis)
   */
  static async getQueueMetrics(): Promise<QueueJobStatus> {
    try {
      const response = await fetch(`${this.API_BASE}/queues`, {
        method: "GET",
        headers: this.getHeaders()
      });

      if (!response.ok) throw new Error("Neuspešno povlačenje queue registara");
      const result = await response.json();
      return result.data || { waiting: 0, active: 0, failed: 0, completed: 0 };
    } catch (error) {
      console.error("🚨 [OBSERVABILITY SERVICE QUEUE ERROR]:", error);
      return { waiting: 0, active: 0, failed: 0, completed: 0 };
    }
  }
}
