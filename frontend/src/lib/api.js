export async function getStripeBillingPortalSession() {
  try {
    const response = await fetch("http://localhost:5000/api/admin/portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
      }
    });
    if (!response.ok) throw new Error("Mrežna greška");
    return await response.json();
  } catch (err) {
    console.error(err);
    return { success: false, url: "#" };
  }
}

export async function getSubscriptionStatus() {
  return { active: true, plan: "Premium" };
}
