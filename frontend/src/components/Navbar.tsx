"use client";

import Link from "next/link";
import { AuthService } from "@/services/auth.service";

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-black tracking-tight text-emerald-400">
              NutriFlow
            </Link>
            <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                Glavna
              </Link>
              <Link href="/dashboard/settings" className="hover:text-emerald-400 transition-colors">
                Podešavanja
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => AuthService.logout()}
              className="py-2 px-4 rounded-xl border border-slate-800 bg-slate-950 text-sm font-semibold hover:bg-slate-800 transition-all"
            >
              🚪 Odjavi se
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
