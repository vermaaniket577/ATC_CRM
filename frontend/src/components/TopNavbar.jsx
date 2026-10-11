import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  CheckCircle,
  Wifi,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TopNavbar = ({ onMenuClick }) => {
  const { user, logout, login } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const availableRoles = [
    { label: 'Super Admin', username: 'superadmin', role: 'ROLE_SUPER_ADMIN', color: 'text-red-600 bg-red-50' },
    { label: 'CRM Manager', username: 'manager', role: 'ROLE_CRM_MANAGER', color: 'text-blue-600 bg-blue-50' },
    { label: 'Sales Executive', username: 'sales1', role: 'ROLE_SALES_EXECUTIVE', color: 'text-orange-600 bg-orange-50' },
    { label: 'Support Executive', username: 'support1', role: 'ROLE_SUPPORT_EXECUTIVE', color: 'text-red-600 bg-red-50' },
    { label: 'Billing Executive', username: 'billing1', role: 'ROLE_BILLING_EXECUTIVE', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Field Technician', username: 'tech1', role: 'ROLE_FIELD_TECHNICIAN', color: 'text-orange-600 bg-orange-50' },
  ];

  const handleRoleSwitch = (r) => {
    login(r.username, 'password123');
    setShowRoleMenu(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Left: Mobile Menu & Live Telecom Network Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-900">Apex Telecom India</span>
          <span className="text-slate-300">/</span>
          {/* Green Live Network Badge */}
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            5G Core Network Live
          </span>
          {/* Orange Circle Tag */}
          <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold border border-orange-200 text-[11px]">
            Circle: MH & DL
          </span>
        </div>
      </div>

      {/* Right Actions: Role Switcher, Notifications, Logout */}
      <div className="flex items-center gap-3">
        {/* Instant Role Switcher Dropdown (Blue accent) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-xs font-bold text-blue-800 transition-colors shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline font-semibold text-slate-600">Role:</span>
            <span>
              {user?.roles?.[0]?.replace('ROLE_', '') || 'SUPER_ADMIN'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Role Profile
              </div>
              <div className="space-y-1 mt-1">
                {availableRoles.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleRoleSwitch(r)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      user?.roles?.includes(r.role) ? 'bg-blue-50 font-bold text-blue-700 border border-blue-200' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${r.color.split(' ')[0].replace('text-', 'bg-')}`}></span>
                      {r.label}
                    </span>
                    {user?.roles?.includes(r.role) && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell with Red Alarm Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Carrier Notifications</span>
                <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200">
                  3 Priority
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {/* Red critical alert */}
                <div className="py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-red-600">Critical SLA Alarm</p>
                    <span className="text-[10px] text-red-500 font-semibold">10m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Ticket #TKT-2026-103 breached 4-hr SLA window</p>
                </div>

                {/* Orange high-value lead alert */}
                <div className="py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-orange-600">High-Value Lead Assigned</p>
                    <span className="text-[10px] text-slate-400">1h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Nexus Logistics (₹4.5L deal) scheduled for follow-up</p>
                </div>

                {/* Green payment settled */}
                <div className="py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-emerald-600">UPI Payment Settled</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">2h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">₹1,414.82 received for Invoice #INV-001</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Red Logout Action */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors border border-transparent hover:border-red-200"
          title="Sign out of Carrier CRM"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
