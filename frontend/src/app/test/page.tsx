"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const testAPI = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/test`
        );

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        setMessage("Greška sa API ❌");
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ padding: "40px", fontSize: "20px" }}>
      <h1>Test Backend</h1>
      <p>{message}</p>
    </div>
  );
}