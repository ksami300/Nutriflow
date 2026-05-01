"use client";

import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/health")
      .then(res => res.json())
      .then(data => console.log("API RADI:", data))
      .catch(err => console.error("API ERROR:", err));
  }, []);

  return (
    <main style={{
      background: "black",
      color: "white",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px",
      fontWeight: "bold"
    }}>
      NutriFlow 🚀 API test
    </main>
  );
}