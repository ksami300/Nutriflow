"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";

export default function RegisterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      alert("❌ Sva polja su obavezna za registraciju naloga.");
      setLoading(false);
      return;
    }

    const result = await AuthService.register(name, email, password);
    if (result.success) {
      alert("🎉 Registracija uspešna! Prebacujemo vas na stranicu za prijavu.");
      window.location.href = "/login";
    } else {
      alert(`❌ Greška: ${result.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Kreirajte nalog</h2>
          <p className="text-slate-400 text-sm mt-2">Pokrenite svoj lični NutriFlow nalog</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Korisničko ime / Ime</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nemanja Mihajlović"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">E-mail adresa</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ime@domen.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Sigurna Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl transition-all"
          >
            {loading ? "Kreiranje naloga..." : "Registruj se"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Već imate nalog?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Prijavite se
          </a>
        </div>
      </div>
    </div>
  );
}
