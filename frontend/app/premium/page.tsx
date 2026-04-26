"use client";

export default function PremiumPage() {
  const handleBuy = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)] text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Premium</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Unlock NutriFlow Premium</h1>
          <p className="mt-4 text-slate-400">Unlimited AI meal plans, priority support, and faster results — optimized for mobile.</p>
          <button
            onClick={handleBuy}
            className="mt-8 w-full rounded-3xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-5 py-4 text-sm font-semibold text-white shadow-xl transition hover:opacity-95"
          >
            Buy Premium (€9.99)
          </button>
        </div>
      </div>
    </div>
  );
}
