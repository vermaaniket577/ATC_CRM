import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in shadow-xl">
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} shadow-lg backdrop-blur-md`}>
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 text-xs font-medium leading-relaxed">{message}</div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
