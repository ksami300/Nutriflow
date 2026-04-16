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
    default: "bg-white border border-neutral-200",
    elevated: "bg-white shadow-lg",
    outline: "bg-transparent border-2 border-neutral-200",
    gradient: "bg-gradient-to-br from-white to-neutral-50 shadow-md",
  };

  return (
    <div
      className={`
        rounded-xl transition-all duration-300
        ${variantClasses[variant]}
        ${padded ? "p-6" : ""}
        ${hoverable ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : ""}
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
    <div className={`flex items-center justify-between mb-4 pb-4 border-b border-neutral-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between pt-4 border-t border-neutral-100 mt-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-xl font-bold text-neutral-900 ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-neutral-600 ${className}`}>{children}</p>;
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
      {icon && <div className="text-6xl mb-4 text-neutral-300">{icon}</div>}
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
      {description && <p className="text-neutral-600 mb-6">{description}</p>}
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
    info: "bg-blue-50 border border-blue-200 text-blue-900",
    success: "bg-green-50 border border-green-200 text-green-900",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-900",
    error: "bg-red-50 border border-red-200 text-red-900",
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className={`rounded-lg p-4 border-l-4 animate-slideDown ${typeClasses[type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl">{icons[type]}</span>
          <div>
            <h4 className="font-semibold">{title}</h4>
            {description && <p className="text-sm opacity-75 mt-1">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 transition">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
