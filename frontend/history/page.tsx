"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [plans, setPlans] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API}/api/plans`)
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📜 History</h1>

      {plans.map((p: any) => (
        <div key={p.id} className="bg-white p-4 mb-4 shadow rounded">
          <pre>{p.plan}</pre>
        </div>
      ))}
    </div>
  );
}