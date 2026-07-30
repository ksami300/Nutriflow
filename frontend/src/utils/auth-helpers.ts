/**
 * 🛡️ KLIJENTSKI PROVERIVAČ PRISUSTVA AKTIVNE JWT SESIJE
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Brza provera formata tokena pre nego što opteretimo mrežne upite
    const parts = token.split(".");
    if (parts.length !== 3) {
      localStorage.removeItem("token");
      return false;
    }
    
    // Provera da li je token istekao dekodiranjem payload segmenta
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("token");
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};

/**
 * 🔒 ZAŠTITNA PRESRET_AČKA FUNKCIJA ZA KLIJENTSKE RUT_E
 */
export const enforceRouteProtection = (redirectTo: string = "/login"): void => {
  if (typeof window !== "undefined" && !isAuthenticated()) {
    window.location.href = redirectTo;
  }
};
