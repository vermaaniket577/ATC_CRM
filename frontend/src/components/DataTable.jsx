import React from 'react';
import { ChevronUp, ChevronDown, Inbox } from 'lucide-react';

export const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No records found",
  onSort,
  sortColumn,
  sortDirection = 'asc',
  keyField = 'id',
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-100 rounded w-full"></div>
          <div className="h-12 bg-slate-50 rounded w-full"></div>
          <div className="h-12 bg-slate-50 rounded w-full"></div>
          <div className="h-12 bg-slate-50 rounded w-full"></div>
          <div className="h-12 bg-slate-50 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3.5 whitespace-nowrap ${col.sortable ? 'cursor-pointer select-none hover:text-slate-800' : ''}`}
                  onClick={() => col.sortable && onSort && onSort(col.accessor)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortColumn === col.accessor && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="w-10 h-10 text-slate-300 stroke-1 mb-2" />
                    <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row[keyField] || rowIdx}
                  className="hover:bg-slate-50/70 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3.5 whitespace-nowrap text-slate-700">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
