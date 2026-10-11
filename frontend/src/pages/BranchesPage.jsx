import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { StatusBadge } from '../components/StatusBadge';

export const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmApi.getBranches().then((data) => {
      setBranches(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Telecom Regional Circles & Operational Hubs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          TRAI licensed service circles, central retail experience stores, and optical fiber interconnect offices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {branches.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 card-hover flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {b.branchCode}
                </span>
                <StatusBadge status={b.status} />
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-1">{b.name}</h3>
              <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{b.addressLine}, {b.city}, {b.state} - {b.pinCode}</span>
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>{b.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-500" />
                <span>5G Core Circle Enabled</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
