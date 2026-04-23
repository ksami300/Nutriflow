"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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
    <div style={{ padding: "40px" }}>
      <h1>NutriFlow 🚀</h1>
      <p>AI generiše personalizovan plan ishrane za tebe u sekundama.</p>

      {/* 🔥 LOGIN BUTTON */}
      <Link href="/login">
        <button
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            background: "black",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </Link>

      <h2 style={{ marginTop: "30px" }}>Test Backend</h2>

      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        {message === "Loading..." ? "Učitavanje..." : message}
      </p>
    </div>
  );
}