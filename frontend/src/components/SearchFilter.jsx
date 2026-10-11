import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search records...",
  filters = [],
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {filters.map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">{filter.label}: All</option>
            {filter.options.map((opt, oIdx) => (
              <option key={oIdx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}

        {onReset && (
          <button
            onClick={onReset}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
