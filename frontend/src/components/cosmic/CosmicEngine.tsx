"use client";

import { useEffect, useRef } from "react";

export default function CosmicEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 500);

    const nodes = [
      { name: "Express API Gateway", x: width / 2, y: height / 2, radius: 25, color: "#10b981", angle: 0 },
      { name: "PostgreSQL Master", x: 0, y: 0, radius: 14, color: "#3b82f6", angle: 1.2 },
      { name: "Redis Cache Cluster", x: 0, y: 0, radius: 12, color: "#ef4444", angle: 2.8 },
      { name: "BullMQ Asinkroni Prsten", x: 0, y: 0, radius: 12, color: "#a855f7", angle: 4.5 },
    ];

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 500;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      nodes.forEach((node, index) => {
        if (index > 0) {
          node.angle += 0.015;
          const orbitRadius = 100 + index * 55;
          node.x = centerX + Math.cos(node.angle) * orbitRadius;
          node.y = centerY + Math.sin(node.angle) * orbitRadius;

          ctx.beginPath();
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(51, 65, 85, 0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
          ctx.stroke();
        } else {
          node.x = centerX;
          node.y = centerY;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.x, node.y - node.radius - 8);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-4 left-4 z-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">NutriFlow Cosmic Node Engine</span>
        <p className="text-[10px] text-slate-500">Vizuelizacija topologije mikroservisa u realnom vremenu (Canvas 2D)</p>
      </div>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}
