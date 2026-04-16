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
    "bg-gradient-to-r from-primary-600 to-accent-light text-white hover:from-primary-700 hover:to-accent-dark shadow-lg hover:shadow-xl active:shadow-md",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200 active:bg-neutral-150",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100",
  ghost: "text-primary-600 hover:bg-primary-50 active:bg-primary-100",
  danger:
    "bg-error text-white hover:bg-red-600 shadow-md hover:shadow-lg active:shadow-sm",
};

const sizeClasses = {
  xs: "px-3 py-1.5 text-xs font-medium rounded-md",
  sm: "px-4 py-2 text-sm font-medium rounded-lg",
  md: "px-6 py-3 text-base font-semibold rounded-lg",
  lg: "px-8 py-4 text-lg font-semibold rounded-xl",
  xl: "px-10 py-5 text-xl font-bold rounded-2xl",
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
        transition-all duration-200
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
          <span className="opacity-75">Loading...</span>
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
        transition-all duration-200
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
    <div className={`inline-flex gap-2 rounded-lg overflow-hidden border border-neutral-200 [&_button]:rounded-none [&_button:first-child]:rounded-l-lg [&_button:last-child]:rounded-r-lg ${className}`}>
      {children}
    </div>
  );
}
