"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outline" | "gradient";
  padded?: boolean;
  hoverable?: boolean;
}

export function Card({
  variant = "default",
  padded = true,
  hoverable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: "bg-slate-900 border border-slate-800 text-slate-100",
    elevated: "bg-slate-900 border border-slate-800 shadow-2xl text-slate-100",
    outline: "bg-slate-950 border-2 border-slate-700 text-slate-100",
    gradient: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-xl text-slate-100",
  };

  return (
    <div
      className={`
        rounded-3xl transition-all duration-300
        ${variantClasses[variant]}
        ${padded ? "p-6" : ""}
        ${hoverable ? "hover:shadow-[0_20px_70px_-30px_rgba(59,130,246,0.6)] hover:-translate-y-1 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-4 pb-4 border-b border-slate-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between pt-4 border-t border-slate-800 mt-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-xl font-bold text-slate-100 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-slate-400 ${className}`}>{children}</p>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card variant="outline" padded className={`text-center py-16 ${className}`}>
      {icon && <div className="text-6xl mb-4 text-slate-400">{icon}</div>}
      <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
      {description && <p className="text-slate-400 mb-6">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

export function Alert({
  type = "info",
  title,
  description,
  action,
  onClose,
}: {
  type?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}) {
  const typeClasses = {
    info: "bg-slate-900 border border-slate-700 text-slate-100",
    success: "bg-slate-950 border border-emerald-700 text-emerald-300",
    warning: "bg-slate-950 border border-amber-600 text-amber-200",
    error: "bg-slate-950 border border-rose-600 text-rose-200",
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className={`rounded-2xl p-4 border-l-4 animate-slideDown ${typeClasses[type]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">{icons[type]}</span>
          <div>
            <h4 className="font-semibold text-slate-100">{title}</h4>
            {description && <p className="text-sm opacity-80 mt-1 text-slate-300">{description}</p>}
            {action && <div className="mt-3">{action}</div>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 transition">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
