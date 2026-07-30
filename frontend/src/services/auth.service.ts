export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export class AuthService {
  private static readonly API_BASE = "http://localhost:5000/api/auth";

  /**
   * 🔑 KLIJENTSKI LOGIN VOD SA AUTOMATSKIM SKLADIŠTENJEM TOKENA
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login neuspešan");

      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
      }
      return { success: true, user: result.data?.user };
    } catch (error: any) {
      console.error("🚨 [AUTH SERVICE LOGIN ERROR]:", error);
      return { success: false, message: error.message || "Mrežna greška pri autorizaciji" };
    }
  }

  /**
   * 📝 KLIJENTSKI REGISTRACIONI PIPELINE KROZ CENTRALNI API GATEWAY
   */
  static async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Registracija neuspešna");
      return { success: true, message: result.message };
    } catch (error: any) {
      console.error("🚨 [AUTH SERVICE REGISTER ERROR]:", error);
      return { success: false, message: error.message || "Mrežna greška pri upisu korisnika" };
    }
  }

  /**
   * 🚪 SIGURNO BRISANJE SESIJE I ODJAVA SA PLATFORME
   */
  static logout(): void {
    localStorage.removeItem("token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
