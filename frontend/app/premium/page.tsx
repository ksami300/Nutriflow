"use client";

export default function PremiumPage() {
  const handleBuy = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>🔥 NutriFlow Premium</h1>

      <p>Unlock unlimited AI nutrition plans</p>

      <button
        onClick={handleBuy}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          background: "black",
          color: "white",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Buy Premium (€9.99)
      </button>
    </div>
  );
}