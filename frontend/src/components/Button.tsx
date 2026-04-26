"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_24px_55px_-25px_rgba(59,130,246,0.9)] hover:shadow-[0_26px_68px_-22px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0.5",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
  outline:
    "border border-slate-600 text-slate-100 hover:bg-slate-900 hover:border-slate-500",
  ghost: "text-slate-100 hover:bg-slate-800/70",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl",
};

const sizeClasses = {
  xs: "px-3 py-1.5 text-xs font-medium rounded-md",
  sm: "px-4 py-2 text-sm font-medium rounded-lg",
  md: "px-6 py-3 text-base font-semibold rounded-xl",
  lg: "px-8 py-4 text-lg font-semibold rounded-2xl",
  xl: "px-10 py-5 text-xl font-bold rounded-[28px]",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
          <span className="opacity-80">Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export function IconButton({
  variant = "ghost",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  children,
  ...props
}: Omit<ButtonProps, "fullWidth">) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        rounded-lg
        ${variantClasses[variant]}
        ${size === "xs" && "p-1"}
        ${size === "sm" && "p-2"}
        ${size === "md" && "p-2.5"}
        ${size === "lg" && "p-3"}
        ${size === "xl" && "p-4"}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
      ) : (
        children
      )}
    </button>
  );
}

export function ButtonGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex gap-2 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 ${className}`}>
      {children}
    </div>
  );
}
