"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "@/utils/auth";

export default function AICoach() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");

  const token = getToken();
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!token) {
      toast.error("Token nije pronađen. Prijavi se ponovo.");
      window.location.href = "/login";
      return;
    }

    if (!msg?.trim()) {
      toast.error("Unesi poruku pre slanja.");
      return;
    }

    if (!apiUrl) {
      toast.error("NEXT_PUBLIC_API_URL nije postavljen");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${apiUrl}/api/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: msg }),
    });

    if (!res.ok) {
      toast.error("Greška pri AI pozivu");
      return;
    }

    const data = await res.json();
    setReply(data.reply);
  } catch {
    toast.error("Greška pri AI pozivu");
  } finally {
    setSending(false);
  }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">AI Coach</h2>

      <input
        className="border p-2 w-full mt-2"
        placeholder="Pitaj trenera..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />

      <button
        onClick={sendMessage}
        disabled={sending}
        className="bg-blue-500 text-white px-4 py-2 mt-2 disabled:opacity-50"
      >
        Pitaj
      </button>

      {reply && <p className="mt-3">{reply}</p>}
    </div>
  );
}