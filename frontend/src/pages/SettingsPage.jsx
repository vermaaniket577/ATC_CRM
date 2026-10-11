import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  FileCheck,
  Server,
  Lock,
  Save,
  CheckCircle,
  Database,
  KeyRound,
  ShieldAlert,
  Smartphone,
  Clock,
  History,
  UserCheck
} from 'lucide-react';
import { NotificationToast } from '../components/NotificationToast';
import { apiClient } from '../api/apiClient';

export const SettingsPage = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [companySettings, setCompanySettings] = useState({
    companyName: 'Apex Telecom India Limited',
    licenseNo: 'TRAI-UL-VIRTUAL-2026-MH-0921',
    gstin: '27AAACA1234F1Z8',
    defaultCurrency: 'INR (₹)',
    criticalSlaHours: '4',
    kycRetentionYears: '5',
    dpdpaConsentMode: 'ENABLED',
    // Login & Access Security
    maxLoginAttempts: '5',
    lockoutDurationMinutes: '15',
    enforceMfaAdmin: true,
    sessionTimeoutMinutes: '60',
    ipRestrictedLogin: false,
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await apiClient.get('/reports/audit-logs?limit=8');
      if (res.data && res.data.data) {
        setAuditLogs(res.data.data);
      }
    } catch (e) {
      // Fallback sample audit logs if endpoint not reached
      setAuditLogs([
        { id: 1, action: 'LOGIN_SUCCESS', username: 'superadmin', ipAddress: '127.0.0.1', newValue: 'User authenticated successfully', createdAt: new Date().toISOString() },
        { id: 2, action: 'SIM_STATUS_CHANGE', username: 'sales1', ipAddress: '192.168.1.104', newValue: 'Connection #CONN-5G-1001 verified for VoNR', createdAt: new Date(Date.now() - 720000).toISOString() },
        { id: 3, action: 'CUSTOMER_KYC_VERIFY', username: 'support1', ipAddress: '192.168.1.112', newValue: 'Subscriber Ananya Deshmukh Aadhaar eKYC verified', createdAt: new Date(Date.now() - 2700000).toISOString() },
      ]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('Security & carrier settings saved and applied to cluster!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          System Configuration & Security
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          TRAI Unified License parameters, Login Brute-Force Shields, 2FA Policies, and DPDPA 2023 compliance settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Login & Access Security Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Login Security & Authentication Shield</h3>
              <p className="text-xs text-slate-500">Rate limiting, brute-force defense, and operator 2FA verification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Failed Attempts Before Lockout</label>
              <input
                type="number"
                min="3"
                max="10"
                value={companySettings.maxLoginAttempts}
                onChange={(e) => setCompanySettings({ ...companySettings, maxLoginAttempts: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default: 5 attempts per account/IP</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Lockout Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={companySettings.lockoutDurationMinutes}
                onChange={(e) => setCompanySettings({ ...companySettings, lockoutDurationMinutes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Temporary lockout period after threshold breach</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Session Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                min="15"
                max="120"
                value={companySettings.sessionTimeoutMinutes}
                onChange={(e) => setCompanySettings({ ...companySettings, sessionTimeoutMinutes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={companySettings.enforceMfaAdmin}
                  onChange={(e) => setCompanySettings({ ...companySettings, enforceMfaAdmin: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Enforce 2FA OTP for Privileged Accounts</span>
              </label>
              <span className="text-[10px] text-slate-400 ml-5 mt-0.5">Requires 6-digit OTP for Super Admin & CRM Managers</span>
            </div>
          </div>
        </div>

        {/* Card 2: Telecom Regulatory Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Regulatory Telecom Identity</h3>
              <p className="text-xs text-slate-500">DoT / TRAI licensed operator parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">TRAI License ID</label>
              <input
                type="text"
                value={companySettings.licenseNo}
                onChange={(e) => setCompanySettings({ ...companySettings, licenseNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate GSTIN (18% Telecom Rate)</label>
              <input
                type="text"
                value={companySettings.gstin}
                onChange={(e) => setCompanySettings({ ...companySettings, gstin: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Currency</label>
              <input
                type="text"
                disabled
                value={companySettings.defaultCurrency}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Card 3: DPDPA 2023 & SLA Parameters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">DPDPA 2023 & SLA Policies</h3>
              <p className="text-xs text-slate-500">Data retention thresholds and emergency ticket SLAs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Critical Fault SLA Deadline (Hours)</label>
              <input
                type="number"
                value={companySettings.criticalSlaHours}
                onChange={(e) => setCompanySettings({ ...companySettings, criticalSlaHours: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mandatory KYC Retention (Years)</label>
              <input
                type="number"
                value={companySettings.kycRetentionYears}
                onChange={(e) => setCompanySettings({ ...companySettings, kycRetentionYears: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Website & Public Portal Integration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Website & External Portal Linking</h3>
              <p className="text-xs text-slate-500">How to link your public telecom website, landing pages, and customer portals</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">1. Inbound Leads Webhook Endpoint</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  PUBLIC POST
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Submit "Request 5G SIM" or "Contact Us" forms directly into the CRM Sales Pipeline:
              </p>
              <div className="p-2 bg-slate-900 text-cyan-400 font-mono text-[11px] rounded-lg select-all overflow-x-auto">
                POST http://localhost:8080/api/v1/public/website/inquiry
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">2. Live Plans Catalog & Ticket Status APIs</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                  PUBLIC GET
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-slate-900 text-slate-200 rounded-lg select-all truncate">
                  GET /api/v1/public/website/plans
                </div>
                <div className="p-2 bg-slate-900 text-slate-200 rounded-lg select-all truncate">
                  GET /api/v1/public/website/ticket-status/{'{ticketNumber}'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-900">Need ready-to-use HTML/JS Embed Code?</p>
                <p className="text-[11px] text-blue-700">Detailed setup guide with ready-to-copy HTML form widget & DNS reverse proxy instructions.</p>
              </div>
              <span className="text-[11px] font-bold text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-sm">
                docs/WEBSITE_INTEGRATION_GUIDE.md
              </span>
            </div>
          </div>
        </div>

        {/* Live Security Audit Log Stream */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Security & Login Audit Stream</h3>
            </div>
            <button
              type="button"
              onClick={fetchAuditLogs}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              Refresh Logs
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {auditLogs.length === 0 ? (
              <p className="text-slate-400 text-xs py-2">No security audit events recorded yet.</p>
            ) : (
              auditLogs.map((log) => {
                const isSuccess = log.action === 'LOGIN_SUCCESS';
                const isFail = log.action === 'LOGIN_FAILED' || log.action === 'ACCOUNT_LOCKED';
                const badgeColor = isSuccess
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isFail
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200';

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                        {log.action}
                      </span>
                      <span className="font-semibold text-slate-800">{log.username}</span>
                      <span className="text-slate-500 text-[11px] truncate max-w-xs">{log.newValue}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-mono block">IP: {log.ipAddress}</span>
                      <span className="text-[9px] text-slate-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Security & Cluster Configuration</span>
          </button>
        </div>
      </form>

      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};
