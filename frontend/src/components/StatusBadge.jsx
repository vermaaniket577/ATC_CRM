import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  const colorStyles = {
    // General Active / Verified
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    VERIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    CONVERTED: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/20',

    // In Progress / Warning
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    ASSIGNED: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
    SCHEDULED: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20',
    PARTIALLY_PAID: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    PENDING_ACTIVATION: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    QUALIFIED: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    PROPOSAL_SENT: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
    NEGOTIATION: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',

    // Danger / Suspended
    SUSPENDED: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    DEACTIVATED: 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/20',
    ARCHIVED: 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/20',
    OVERDUE: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    UNPAID: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    LOST: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse ring-rose-500/30',

    // Priorities
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    LOW: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20',
    URGENT: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',

    // Plans / Customer types
    PREPAID: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    POSTPAID: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
    ENTERPRISE: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
    VIP: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold ring-amber-500/30',
    CORPORATE: 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-500/20',
  };

  const style = colorStyles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  const formatText = (txt) => {
    return txt.replace(/_/g, ' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ring-1 ring-inset ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
      {formatText(status)}
    </span>
  );
};
