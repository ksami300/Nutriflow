"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(() => setMessage("ERROR"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Backend Test</h1>
      <p>Status: {message}</p>
    </div>
  );
}