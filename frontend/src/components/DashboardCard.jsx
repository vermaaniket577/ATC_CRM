import React from 'react';

export const DashboardCard = ({ title, value, subtext, icon: Icon, trend, trendLabel, color = 'blue' }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      gradient: 'from-blue-600 to-cyan-500',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      gradient: 'from-emerald-600 to-teal-500',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      gradient: 'from-amber-600 to-orange-500',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      gradient: 'from-rose-600 to-pink-500',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      gradient: 'from-purple-600 to-indigo-500',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm card-hover relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} shadow-inner`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
        <span>{subtext}</span>
        {trend && (
          <span className={`inline-flex items-center font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend > 0 ? '↑ +' : '↓ '}{trend}%
            {trendLabel && <span className="ml-1 text-slate-400 font-normal">{trendLabel}</span>}
          </span>
        )}
      </div>

      {/* Decorative gradient bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${scheme.gradient} opacity-80`} />
    </div>
  );
};
