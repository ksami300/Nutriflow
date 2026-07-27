// 🌐 CENTRALNA KONFIGURACIJA NUTRIFLOW API KLIJENTA
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Pomoćna funkcija za automatsko slanje zaštićenih mrežnih zaglavlja
const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

// 🟢 1. REGISTRACIJA KORISNIKA
export const registerUser = async (payload: any) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Registracija neuspešna. Proverite unete podatke.");
  return response.json();
};

// ⚡ 2. PRIJAVA / LOGIN KORISNIKA
export const loginUser = async (payload: any) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Netačan email ili lozinka.");
  return response.json();
};

// 👤 3. PREUZIMANJE PODATAKA TRENUTNOG KORISNIKA
export const getMe = async () => {
  const response = await fetch(`${API_URL}/api/auth/profile`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Neuspešno povlačenje profila.");
  const resData = await response.json();
  return resData.data;
};

// 📊 4. POZIV ZA AUTOMATSKO AI GENERISANJE PLANA ISHRANE I NFL TRENINGA
export const generatePlan = async (payload: any) => {
  const response = await fetch(`${API_URL}/api/meal-plans`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("AI procesor u Frankfurtu je odbio zahtev za generisanje.");
  const resData = await response.json();
  return resData.data;
};

// 📋 5. POZIV ZA PREUZIMANJE ISTORIJE SVIH GENERISANIH PLANOVA
export const getMyPlans = async () => {
  const response = await fetch(`${API_URL}/api/meal-plans`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Neuspešno povlačenje istorije planova.");
  const resData = await response.json();
  return resData.data;
};

// 🗑️ 6. BRISANJE ODREĐENOG PLANA ISHRANE IZ BAZE
export const deletePlan = async (id: string) => {
  const response = await fetch(`${API_URL}/api/meal-plans/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Brisanje plana ishrane nije uspelo.");
  return response.json();
};

// 🔗 7. JAVNO DELJENJE PLANA PREKO LINKA
export const sharePlan = async (id: string) => {
  const response = await fetch(`${API_URL}/api/meal-plans/${id}/share`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Generisanje javnog linka nije uspelo.");
  return response.json();
};

// 👑 8. PROVERA STATUS PREPLATE KORISNIKA (Stripe status)
export const getSubscriptionStatus = async () => {
  const response = await fetch(`${API_URL}/api/payments/status`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) return { isPremium: false };
  const resData = await response.json();
  return resData.data;
};

// 💳 9. ASINHRONI UPIT KA STRIPE CUSTOMER BILLING PORTALU (George/Erste upravljanje)
export const getStripeBillingPortalSession = async () => {
  const response = await fetch(`${API_URL}/api/billing/portal-session`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Udaljeni server u Frankfurtu je odbio finansijski upit.");
  }
  return response.json();
};
