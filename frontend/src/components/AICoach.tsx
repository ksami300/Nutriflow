"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "@/utils/auth";

export default function AICoach() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");

  const token = getToken();

  const sendMessage = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      toast.error("NEXT_PUBLIC_API_URL nije postavljen");
      return;
    }

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
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">AI Coach</h2>

      <input
        className="border p-2 w-full mt-2"
        placeholder="Pitaj trenera..."
        onChange={(e) => setMsg(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Pitaj
      </button>

      {reply && <p className="mt-3">{reply}</p>}
    </div>
  );
}