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
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon,
  trend,
  accentColor = 'bg-transit-500'
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            {subValue && <span className="text-xs text-slate-500 font-medium">{subValue}</span>}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400">vs last hour</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  );
};
