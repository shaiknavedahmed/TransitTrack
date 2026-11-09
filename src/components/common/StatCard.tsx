import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: string;
  footerNote?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon,
  trend,
  accentColor = 'border-l-emerald-600',
  footerNote
}) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-200/90 p-4 shadow-subtle hover:border-slate-300 transition-colors border-l-4 ${accentColor}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {value}
            </span>
            {subValue && (
              <span className="text-xs text-slate-500 font-medium truncate">
                {subValue}
              </span>
            )}
          </div>

          {(trend || footerNote) && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              {trend && (
                <span className={`font-semibold flex items-center gap-0.5 ${trend.isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                  <span>{trend.isPositive ? '▲' : '▼'}</span>
                  <span>{trend.value}</span>
                </span>
              )}
              {footerNote && (
                <span className="text-slate-400 truncate">{footerNote}</span>
              )}
            </div>
          )}
        </div>

        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200/70 text-slate-600 shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};
