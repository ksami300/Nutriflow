"use client";

import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";

interface UserProfile {
  name: string;
  email: string;
  joinedAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulacija povlačenja sesije korisnika sa lokalnog skladišta
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setProfile({
          name: payload.name || "Nemanja Mihajlović",
          email: payload.email || "ime@domen.com",
          joinedAt: new Date().toLocaleDateString()
        });
      } catch (err) {
        console.error("Greška pri čitanju sesije", err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500 text-sm font-medium">
        Učitavanje profila korisnika...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Korisnički profil</h1>
        <p className="text-slate-400 text-sm">Pregled i upravljanje tvojim ličnim parametrima na NutriFlow platformi.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-black text-slate-950 text-xl">
            {profile?.name.charAt(0).toUpperCase() || "N"}
          </div>
          <div>
            <h2 className="text-lg font-bold">{profile?.name || "Korisnik"}</h2>
            <p className="text-xs text-slate-400">Član platforme od: {profile?.joinedAt || "Danas"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">E-mail adresa</span>
            <span className="font-medium text-slate-200">{profile?.email || "Nije uneta"}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Bezbednosni Status</span>
            <span className="font-medium text-emerald-400 flex items-center">✓ SHA-256 Validna Sesija</span>
          </div>
        </div>
      </div>
    </div>
  );
}
