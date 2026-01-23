'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export function Card({ children, className = '', bordered = false }: CardProps) {
  return (
    <div
      className={`
        bg-slate-800 rounded-lg px-6 py-5
        ${bordered ? 'border border-slate-700' : ''}
        shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700 text-slate-100',
    success: 'bg-green-900/30 text-green-300 border border-green-700/50',
    warning: 'bg-amber-900/30 text-amber-300 border border-amber-700/50',
    error: 'bg-red-900/30 text-red-300 border border-red-700/50',
    info: 'bg-blue-900/30 text-blue-300 border border-blue-700/50',
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full
        text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants_ = {
    primary:
      'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-600',
    secondary:
      'bg-amber-500 text-slate-900 hover:bg-amber-600 active:bg-amber-700 disabled:bg-amber-500',
    outline:
      'border-2 border-green-600 text-green-400 hover:bg-green-600/10 active:bg-green-600/20',
    ghost: 'text-green-400 hover:bg-slate-700 active:bg-slate-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants_[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? '⏳ Loading...' : children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-slate-700 border border-slate-600
          text-slate-100 placeholder-slate-400
          focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
          transition-colors duration-200
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-slate-400">{helperText}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-slate-700 border border-slate-600
          text-slate-100
          focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
          transition-colors duration-200
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function Metric({ label, value, unit, icon, trend, trendValue }: MetricProps) {
  const trendColor = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-100">
            {value}
            {unit && <span className="text-lg text-slate-400 ml-1">{unit}</span>}
          </p>
        </div>
        {trend && trendValue && (
          <p className={`text-xs mt-1 ${trendColor[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </p>
        )}
      </div>
      {icon && <div className="text-3xl text-slate-500">{icon}</div>}
    </div>
  );
}

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Alert({ children, variant = 'info', className = '' }: AlertProps) {
  const variants_ = {
    info: 'bg-blue-900/30 border-blue-700/50 text-blue-200',
    success: 'bg-green-900/30 border-green-700/50 text-green-200',
    warning: 'bg-amber-900/30 border-amber-700/50 text-amber-200',
    error: 'bg-red-900/30 border-red-700/50 text-red-200',
  };

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border
        ${variants_[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
