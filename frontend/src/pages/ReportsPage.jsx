import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Building,
  Users,
  CreditCard,
  Radio,
  LifeBuoy,
  Kanban,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { NotificationToast } from '../components/NotificationToast';

export const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    crmApi.getReportsSummary().then((data) => {
      setReportData(data);
      setLoading(false);
    });
  }, []);

  const handleDownloadCsv = (type) => {
    window.open(`/api/v1/reports/export/csv?type=${type}`, '_blank');
    setToastMessage(`Exporting ${type} dataset to CSV file...`);
  };

  const reportItems = [
    {
      title: 'Customer Registration & KYC Report',
      description: 'Audit report of all onboarded individual and corporate subscribers with KYC status.',
      type: 'customers',
      icon: Users,
      count: reportData?.totalCustomers || 5420,
      label: 'Total Subscribers',
    },
    {
      title: 'Invoice Ledger & Tax Settlements',
      description: 'Itemized billing records, 18% GST collected, and outstanding dunning balances.',
      type: 'invoices',
      icon: CreditCard,
      count: '₹36.4 Lakhs',
      label: 'Billed Revenue',
    },
    {
      title: 'Sales Pipeline & Conversion Ratio',
      description: 'Performance breakdown of sales executives across B2B deals and fleet activations.',
      type: 'leads',
      icon: Kanban,
      count: reportData?.totalLeads || 260,
      label: 'Opportunities Tracked',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Executive Reports & Regulatory Compliance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export DoT audit logs, subscriber demographics, circle-wise collections, and SLA metrics.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Executive Pack</span>
        </button>
      </div>

      {/* Exportable Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reportItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 card-hover flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">
                    {item.count}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDownloadCsv(item.type)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-xl text-xs border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Download Full CSV</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circle-Wise Operations Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Regional Circle Business Performance</h3>
            <p className="text-xs text-slate-500">Active subscriber lines, collection revenue, and open SLA escalations</p>
          </div>
          <span className="text-xs font-bold text-slate-500">DoT Circle Audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Telecom Circle Hub</th>
                <th className="px-4 py-3 text-right">Active Subscribers</th>
                <th className="px-4 py-3 text-right">Collections (₹ Lakhs)</th>
                <th className="px-4 py-3 text-right">Open Complaints</th>
                <th className="px-4 py-3 text-center">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData?.branchPerformance?.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{b.branch}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{b.activeSubs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">₹{b.revenueLakhs} L</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-600 font-bold">{b.openTickets}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      99.4% Pass
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};
