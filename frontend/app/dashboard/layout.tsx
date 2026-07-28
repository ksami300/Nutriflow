"use client";

import Link from "next/navigation";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 📋 Definišemo niz navigacionih veza ukljućujući i novi monitoring sistem
  const navItems = [
    { name: "📋 Moja Ishrana", href: "/dashboard" },
    { name: "👤 Moj Profil", href: "/dashboard/profile" },
    { name: "⚙️ Podešavanja", href: "/dashboard/settings" },
    { name: "📈 Monitoring", href: "/dashboard/metrics" }, // 🔥 NOVA VEZA KREIRANA U MILIMETAR!
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* 🦅 CENTRALNI ŠIK BOČNI SIDEBAR PANEL */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white p-6 shadow-sm hidden md:flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              🥦 NutriFlow Premium
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">B2C AI Lifecycle Engine</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-100 pt-4 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Version 1.0.0 Live</p>
        </div>
      </aside>

      {/* 🚀 GLAVNI KONTEJNER ZA STRANICE (Children) */}
      <main className="flex-1 md:pl-64">
        {/* Mobilna brza navigaciona traka na vrhu za responsive ugođaj */}
        <header className="flex md:hidden items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <span className="font-bold text-slate-900">🥦 NutriFlow</span>
          <div className="flex gap-4 text-xs font-semibold text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-950">Ishrana</Link>
            <Link href="/dashboard/profile" className="hover:text-slate-950">Profil</Link>
            <Link href="/dashboard/metrics" className="hover:text-slate-950">Status</Link>
          </div>
        </header>

        <div className="w-full">
          {children}
        </div>
      </main>

    </div>
  );
}
