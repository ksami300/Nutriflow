"use client";

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={inline-block rounded-full border-2 border-slate-500 border-t-transparent animate-spin } />
  );
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)] p-8 text-center space-y-4 animate-scaleIn">
        <Spinner size="lg" />
        <p className="text-slate-100 font-medium">{message}</p>
      </div>
    </div>
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
      <div className="text-center space-y-4 animate-slideUp">
        <Spinner size="lg" />
        <p className="text-slate-100 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={space-y-2 animate-pulse }>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={h-4 bg-slate-800 rounded-lg }
        />
      ))}
    </div>
  );
}

export function Badge({ label, variant = "primary", size = "md" }: { label: string; variant?: "primary" | "success" | "warning" | "error" | "neutral"; size?: "sm" | "md" | "lg" }) {
  const variantClasses = {
    primary: "bg-blue-500/15 text-blue-200 border border-blue-500/20",
    success: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-200 border border-amber-500/20",
    error: "bg-rose-500/15 text-rose-200 border border-rose-500/20",
    neutral: "bg-slate-800 text-slate-200 border border-slate-700",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs font-medium rounded-full",
    md: "px-3 py-1.5 text-sm font-semibold rounded-full",
    lg: "px-4 py-2 text-base font-semibold rounded-full",
  };

  return <span className={inline-flex items-center justify-center  }>{label}</span>;
}

export function Progress({ value, max = 100, label, showValue = true }: { value: number; max?: number; label?: string; showValue?: boolean }) {
  const percentage = (value / max) * 100;

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between items-center text-slate-300 text-sm font-medium">
          {label && <span>{label}</span>}
          {showValue && <span>{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
          style={{ width: ${percentage}% }}
        />
      </div>
    </div>
  );
}

export function Tooltip({ children, content, position = "top" }: { children: React.ReactNode; content: string; position?: "top" | "bottom" | "left" | "right" }) {
  const positionClasses = {
    top: "bottom-full mb-2 -translate-x-1/2 left-1/2",
    bottom: "top-full mt-2 -translate-x-1/2 left-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={
          absolute hidden group-hover:block
          bg-slate-900 text-slate-100 text-xs font-medium px-3 py-2 rounded-2xl
          whitespace-nowrap pointer-events-none z-50 animate-fadeIn
          
        }
      >
        {content}
      </div>
    </div>
  );
}
