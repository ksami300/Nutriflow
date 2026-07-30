"use client";

import { useState } from "react";
import { AiCoachService, ChatMessage } from "@/services/ai-coach.service";
import { ErrorBoundaryService } from "@/services/error-boundary.service";

export default function AiCoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Pozdrav! Ja sam tvoj NutriFlow AI fitnes i nutricionistički savetnik. Postavi mi pitanje u vezi sa planom ishrane, makronutrijentima ili optimizacijom treninga." }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const updatedHistory = [...messages, userMessage];
    
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const result = await AiCoachService.sendMessage(updatedHistory);
      if (result.success && result.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.reply! }]);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      ErrorBoundaryService.handleHttpError(error, "AI podsistem trenutno nije u mogućnosti da obradi poruku");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col h-[calc(100min-100px)] text-white bg-slate-950">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">AI Nutricionistički Savetnik</h1>
        <p className="text-slate-400 text-sm">Inteligentni razgovori i stručne instrukcije generisane u realnom vremenu.</p>
      </div>

      {/* PROZOR ZA PRIKAZ TOKA KONVERZACIJE */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4 min-h-[400px] max-h-[550px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xl rounded-2xl px-4 py-3 text-sm font-medium shadow-md ${
                msg.role === "user"
                  ? "bg-emerald-500 text-slate-950 rounded-tr-none"
                  : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm font-medium animate-pulse">
              AI Coach analizira podatke i generiše odgovor...
            </div>
          </div>
        )}
      </div>

      {/* STRUKTURIRANA FORMA ZA SLANJE UPITA */}
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Postavi pitanje tvom AI treneru..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl transition-all text-sm"
        >
          Pošalji
        </button>
      </form>
    </div>
  );
}
