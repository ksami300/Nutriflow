"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { getToken } from "@/utils/auth";
import { Card, CardHeader, CardTitle } from "./Card";
import { Input } from "./FormInputs";
import { Button, IconButton } from "./Button";
import { Spinner, Badge } from "./UI";

export default function AICoach() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [isSending, setSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in again");
      window.location.href = "/login";
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!apiUrl) {
      toast.error("API URL not configured");
      return;
    }

    setSending(true);
    const userMessage = message;
    setMessage("");

    try {
      // Add user message to history
      setConversationHistory((prev) => [...prev, { role: "user", content: userMessage }]);

      const res = await fetch(`${apiUrl}/api/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to get AI response");
      }

      const data = await res.json();
      const aiReply = data.reply || "No response received";
      
      setReply(aiReply);
      setConversationHistory((prev) => [...prev, { role: "assistant", content: aiReply }]);
      toast.success("Response received!");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "AI service error";
      toast.error(errorMsg);
      // Remove the user message if request failed
      setConversationHistory((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-accent-light text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl animate-bounce"
        title="Open AI Coach"
      >
        🤖
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 max-h-[600px] flex flex-col animate-slideUp">
      <Card variant="elevated" padded={false} className="shadow-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-primary-600 to-accent-light text-white rounded-t-xl rounded-b-none mb-0 pb-0">
          <CardTitle className="text-white">AI Nutrition Coach</CardTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </CardHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {conversationHistory.length === 0 && !reply && (
            <div className="text-center py-8 text-neutral-500">
              <p className="text-3xl mb-2">👋</p>
              <p className="text-sm font-medium">Hi! Ask me anything about nutrition, meal plans, or fitness!</p>
            </div>
          )}

          {conversationHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slideUp`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-xl ${
                  msg.role === "user"
                    ? "bg-primary-600 text-white rounded-br-none"
                    : "bg-neutral-100 text-neutral-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 text-neutral-900 px-4 py-3 rounded-xl rounded-bl-none flex items-center gap-2">
                <Spinner size="sm" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t border-neutral-200 p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isSending}
              className="text-sm"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSending}
              className="flex-shrink-0"
            >
              Send
            </Button>
          </div>
          <Badge label="💡 Tip: Ask about macros, meal timing, or workout recovery" variant="neutral" size="sm" />
        </form>
      </Card>
    </div>
  );
}