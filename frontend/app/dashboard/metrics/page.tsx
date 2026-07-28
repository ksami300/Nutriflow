"use client";

import { useEffect, useState } from "react";

export default function DeepSpaceGalaxyMetrics() {
  const [metrics] = useState<any>({
    uptime: "24h 15m 32s",
    memory: "142MB / 512MB",
    cpu: "12%",
    users: 132,
    mealPlans: 514,
    premiumUsers: 48
  });
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState({ x: -15, y: -15 });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // 🪐 MEHANIKA ZA SLOBODNO ROTIRANJE I POMERANJE CELE GALAKSIJE MIŠEM
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - rotation.y);
    setStartY(e.clientY - rotation.x);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newY = e.clientX - startX;
    const newX = e.clientY - startY;
    setRotation({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono">
        <div className="text-cyan-400 text-sm tracking-[0.4em] animate-pulse uppercase">
          🛸 Otvaranje hiper-prostora i učitavanje zvezdanih mapa...
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-slate-950 text-white p-8 font-mono select-none overflow-hidden relative flex flex-col justify-between"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* ✨ KOSMIČKA ZVEZDANA POZADINA */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-transparent to-cyan-950/20 pointer-events-none"></div>

      {/* 🌌 HUD DISPLEJ TOPOLOGIJE */}
      <div className="relative z-10 border border-cyan-500/30 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl max-w-xl pointer-events-auto shadow-2xl shadow-cyan-950/50">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-[0.25em]">B2C Architecture Galaxy</p>
        <h1 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">NutriFlow Cosmic Orbit v1.0</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">Pritisni levi klik i prevlači miš bilo gde na ekranu da rotiraš ceo zvezdani sistem u 3D prostoru. Planete konstantno kruže oko centralnog Express jezgra.</p>
      </div>

      {/* 🪐 GLAVNI 3D SVEMIRSKI KONTENJER */}
      <div className="flex-1 flex items-center justify-center relative min-h-[450px]" style={{ perspective: "1000px" }}>
        
        {/* GALAKSIJSKO JEZGRO KOJE SE ROTIRA MIŠEM */}
        <div 
          className="relative w-[300px] h-[300px] flex items-center justify-center transition-transform duration-75"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          
          {/* ☀️ CENTRALNA ZVEZDA: EXPRESS API GATEWAY */}
          <div 
            className="absolute bg-gradient-to-r from-cyan-400 to-emerald-500 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.6)] border border-white/40 text-slate-950 z-20"
            style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
          >
            <span className="text-3xl animate-spin [animation-duration:8s]">⚡</span>
            <span className="text-xs font-black tracking-tighter uppercase mt-1">Express API</span>
            <span className="text-[9px] font-bold opacity-80">Core Node</span>
          </div>

          {/* 궤도 LINIJA 1: REDIS SATELIT */}
          <div 
            className="absolute border border-purple-500/30 w-[240px] h-[240px] rounded-full pointer-events-none animate-spin [animation-duration:12s]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* PLANETA REDIS */}
            <div 
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-purple-500 p-3 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] w-24 h-24 text-center pointer-events-auto hover:scale-110 transition"
              style={{ transform: "rotateX(15deg)" }}
            >
              <span className="text-xl">🐳</span>
              <span className="text-[10px] font-black mt-1">BullMQ</span>
              <span className="text-[8px] text-purple-400 font-bold">5 Threads</span>
            </div>
          </div>

          {/* 궤do LINIJA 2: MONGODB PLANETA */}
          <div 
            className="absolute border border-amber-500/20 w-[420px] h-[420px] rounded-full pointer-events-none animate-spin [animation-duration:20s] [animation-direction:reverse]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* PLANETA MONGODB */}
            <div 
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-amber-500 p-3 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] w-28 h-24 text-center pointer-events-auto hover:scale-110 transition"
              style={{ transform: "rotateX(-15deg)" }}
            >
              <span className="text-xl">🪐</span>
              <span className="text-[10px] font-black mt-1">MongoDB</span>
              <span className="text-[8px] text-amber-400 font-bold">{metrics.mealPlans} Docs</span>
            </div>
          </div>

        </div>
      </div>

      {/* 📊 TELEMETRIJSKE METRIKE KAO DREVNIM KOSMIČKI HUD */}
      <div className="relative z-10 grid gap-4 sm:grid-cols-3 max-w-5xl mx-auto w-full border-t border-slate-800/80 pt-6 bg-slate-950/80 backdrop-blur-sm">
        <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center">
          <span className="text-xs text-slate-500 uppercase font-bold">System Pulse</span>
          <span className="text-sm font-bold text-emerald-400 tracking-wider font-mono">{metrics.uptime}</span>
        </div>
        <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center">
          <span className="text-xs text-slate-500 uppercase font-bold">RAM Allocation</span>
          <span className="text-sm font-bold text-cyan-400 tracking-wider font-mono">{metrics.memory}</span>
        </div>
        <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center">
          <span className="text-xs text-slate-500 uppercase font-bold">Live Users</span>
          <span className="text-sm font-bold text-amber-400 tracking-wider font-mono">👥 {metrics.users} Active</span>
        </div>
      </div>

    </div>
  );
}
