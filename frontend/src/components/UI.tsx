"use client";

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${sizeClasses[size]}`} />
  );
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-4 animate-scaleIn">
        <Spinner size="lg" />
        <p className="text-neutral-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center z-50">
      <div className="text-center space-y-4 animate-slideUp">
        <Spinner size="lg" />
        <p className="text-neutral-700 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg ${i === lines - 1 ? "w-4/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function Badge({ label, variant = "primary", size = "md" }: { label: string; variant?: "primary" | "success" | "warning" | "error" | "neutral"; size?: "sm" | "md" | "lg" }) {
  const variantClasses = {
    primary: "bg-primary-100 text-primary-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    neutral: "bg-neutral-100 text-neutral-700",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs font-medium rounded",
    md: "px-3 py-1.5 text-sm font-semibold rounded-lg",
    lg: "px-4 py-2 text-base font-semibold rounded-lg",
  };

  return <span className={`inline-block ${variantClasses[variant]} ${sizeClasses[size]}`}>{label}</span>;
}

export function Progress({ value, max = 100, label, showValue = true }: { value: number; max?: number; label?: string; showValue?: boolean }) {
  const percentage = (value / max) * 100;

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-neutral-700">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-primary-600">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-light rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
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
        className={`
          absolute hidden group-hover:block
          bg-neutral-900 text-white text-xs font-medium px-3 py-2 rounded-lg
          whitespace-nowrap pointer-events-none z-50 animate-fadeIn
          ${positionClasses[position]}
        `}
      >
        {content}
      </div>
    </div>
  );
}
