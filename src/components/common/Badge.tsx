import React from 'react';

interface BadgeProps {
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray' | 'dark';
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'blue',
  children,
  className = '',
  size = 'sm',
  dot = false
}) => {
  const variantStyles = {
    green: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-300/80',
    red: 'bg-rose-50 text-rose-800 border-rose-300/80',
    blue: 'bg-sky-50 text-sky-800 border-sky-300/80',
    purple: 'bg-purple-50 text-purple-800 border-purple-300/80',
    gray: 'bg-slate-100 text-slate-700 border-slate-300/70',
    dark: 'bg-slate-900 text-slate-200 border-slate-700'
  };

  const dotColors = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
    blue: 'bg-sky-500',
    purple: 'bg-purple-500',
    gray: 'bg-slate-400',
    dark: 'bg-emerald-400'
  };

  const sizeStyles = {
    xs: 'text-[10px] font-medium px-1.5 py-0.2',
    sm: 'text-[11px] font-semibold px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border tracking-tight ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
};
