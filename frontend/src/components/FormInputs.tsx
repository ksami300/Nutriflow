"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
  required?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  hint?: string;
  required?: boolean;
}

export function Input({
  label,
  error,
  icon,
  hint,
  required,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2 animate-slideUp">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</div>}
        <input
          {...props}
          className={`
            w-full px-4 py-3 rounded-lg border-2 border-neutral-200
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            hover:border-neutral-300
            ${icon ? "pl-10" : ""}
            ${error ? "border-error focus:border-error focus:ring-error/20" : ""}
            ${className}
          `}
        />
      </div>
      {error && <p className="text-sm text-error font-medium animate-slideUp">{error}</p>}
      {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
    </div>
  );
}

export function Select({ label, error, options, hint, required, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-2 animate-slideUp">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full px-4 py-3 rounded-lg border-2 border-neutral-200
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          hover:border-neutral-300
          bg-white
          ${error ? "border-error focus:border-error focus:ring-error/20" : ""}
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-error font-medium animate-slideUp">{error}</p>}
      {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  hint,
  required,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2 animate-slideUp">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full px-4 py-3 rounded-lg border-2 border-neutral-200
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          hover:border-neutral-300
          resize-none
          ${error ? "border-error focus:border-error focus:ring-error/20" : ""}
          ${className}
        `}
      />
      {error && <p className="text-sm text-error font-medium animate-slideUp">{error}</p>}
      {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
    </div>
  );
}
