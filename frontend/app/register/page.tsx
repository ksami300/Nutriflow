"use client";

import { useState } from "react";
import { registerUser } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { error } from "@/lib/logger";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await registerUser({ name, email, password });

      if (!data?.token) {
        throw new Error("Registration response did not include an auth token.");
      }

      setToken(data.token);
      router.push("/dashboard");
    } catch (err: any) {
      error("REGISTER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.error || err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Register</h1>

      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}