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
        <label className="block text-sm font-semibold text-slate-200">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          {...props}
          className={`
            w-full px-4 py-3 rounded-3xl border border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500
            hover:border-slate-600
            ${icon ? "pl-12" : ""}
            ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""}
            ${className}
          `}
        />
      </div>
      {error && <p className="text-sm text-rose-400 font-medium animate-slideUp">{error}</p>}
      {hint && !error && <p className="text-sm text-slate-400">{hint}</p>}
    </div>
  );
}

export function Select({ label, error, options, hint, required, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-2 animate-slideUp">
      {label && (
        <label className="block text-sm font-semibold text-slate-200">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full px-4 py-3 rounded-3xl border border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500
          hover:border-slate-600
          ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""}
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-rose-400 font-medium animate-slideUp">{error}</p>}
      {hint && !error && <p className="text-sm text-slate-400">{hint}</p>}
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
        <label className="block text-sm font-semibold text-slate-200">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full px-4 py-3 rounded-3xl border border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500
          hover:border-slate-600
          resize-none
          ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""}
          ${className}
        `}
      />
      {error && <p className="text-sm text-rose-400 font-medium animate-slideUp">{error}</p>}
      {hint && !error && <p className="text-sm text-slate-400">{hint}</p>}
    </div>
  );
}
