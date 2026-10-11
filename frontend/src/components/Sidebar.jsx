import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Radio,
  Layers,
  Kanban,
  CalendarCheck,
  LifeBuoy,
  CreditCard,
  UserCheck,
  Building2,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  // Color mapping based on Red, White, Orange, Blue, Green theme
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, theme: 'blue' },
    { label: 'Customers', path: '/customers', icon: Users, badge: '5.4k', badgeColor: 'blue', theme: 'blue' },
    { label: 'Connections & SIMs', path: '/connections', icon: Radio, badge: '5G', badgeColor: 'green', theme: 'blue' },
    { label: 'Telecom Plans', path: '/plans', icon: Layers, theme: 'blue' },
    { label: 'Sales Leads', path: '/leads', icon: Kanban, badge: 'New', badgeColor: 'orange', theme: 'orange' },
    { label: 'Follow-ups & Tasks', path: '/followups', icon: CalendarCheck, theme: 'orange' },
    { label: 'Support Tickets', path: '/tickets', icon: LifeBuoy, badge: '23', badgeColor: 'red', theme: 'red' },
    { label: 'Billing & Invoices', path: '/billing', icon: CreditCard, badge: 'GST', badgeColor: 'green', theme: 'green' },
    { label: 'Employees', path: '/employees', icon: UserCheck, role: 'ROLE_CRM_MANAGER', theme: 'blue' },
    { label: 'Branches & Circles', path: '/branches', icon: Building2, role: 'ROLE_CRM_MANAGER', theme: 'orange' },
    { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, theme: 'green' },
    { label: 'Settings', path: '/settings', icon: Settings, theme: 'blue' },
  ];

  const getActiveStyles = (theme) => {
    switch (theme) {
      case 'red':
        return 'bg-red-50 text-red-700 font-bold border-l-4 border-red-600 shadow-sm';
      case 'orange':
        return 'bg-orange-50 text-orange-700 font-bold border-l-4 border-orange-500 shadow-sm';
      case 'green':
        return 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-sm';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-sm';
    }
  };

  const getBadgeStyles = (color) => {
    switch (color) {
      case 'red':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'orange':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Clean Luminous Light Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col shadow-sm
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            {/* Red to Orange Gradient Brand Mark */}
            <div className="w-9 h-9 rounded-xl gradient-red-orange flex items-center justify-center text-white shadow-md shadow-red-500/25">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">APEX</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-orange-50 text-orange-600 font-extrabold border border-orange-200">
                  5G
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                Telecom Enterprise CRM
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Operations & Telecom Services
          </div>

          {navItems.map((item) => {
            if (item.role && !hasRole(item.role)) return null;

            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            const activeStyle = getActiveStyles(item.theme);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all group
                  ${isActive
                    ? activeStyle
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive
                      ? item.theme === 'red' ? 'text-red-600' :
                        item.theme === 'orange' ? 'text-orange-600' :
                        item.theme === 'green' ? 'text-emerald-600' : 'text-blue-600'
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${getBadgeStyles(item.badgeColor)}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Security Tag */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
            {/* Blue to Green gradient user avatar */}
            <div className="w-8 h-8 rounded-lg gradient-blue-green flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName || 'Active Operator'}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-500 font-semibold truncate">
                  {user?.roles?.[0]?.replace('ROLE_', '') || 'SUPER_ADMIN'}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-slate-600 flex items-center justify-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DoT & TRAI Security Shield</span>
          </div>
        </div>
      </aside>
    </>
  );
};
