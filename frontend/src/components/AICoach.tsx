"use client";

import { useState } from "react";
import { getToken } from "@/utils/auth";

export default function AICoach() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");

  const token = getToken();

  const sendMessage = async () => {
    const res = await fetch("http://localhost:5000/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: msg }),
    });

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