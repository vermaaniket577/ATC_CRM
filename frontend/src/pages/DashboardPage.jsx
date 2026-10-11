import React, { useState, useEffect } from 'react';
import {
  Users,
  Radio,
  Kanban,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  Clock,
  CreditCard,
  TrendingUp,
  Receipt,
  Filter,
  Download,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { crmApi } from '../api/apiClient';
import { DashboardCard } from '../components/DashboardCard';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [branchFilter, setBranchFilter] = useState('ALL');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const summary = await crmApi.getDashboardSummary();
    setData(summary);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-xl"></div>
          <div className="h-80 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const COLORS = ['#2563EB', '#F97316', '#10B981', '#EF4444', '#0284C7', '#EA580C'];

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Filtering Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Telecom Operations Dashboard
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
              Live Pan-India
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time subscriber lifecycle metrics, 5G connections, billing revenue, and SLA triage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Circles (Pan-India)</option>
              <option value="MUMBAI">Mumbai West Circle</option>
              <option value="DELHI">Delhi NCR Circle</option>
              <option value="BLR">Bengaluru Tech Circle</option>
              <option value="HYD">Hyderabad Cyberabad Hub</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days (Current Month)</option>
              <option value="90d">Quarter to Date (Q3)</option>
              <option value="1y">Fiscal Year 2026-27</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 1: Key Subscriber & Commercial Metrics (Blue, Green, Orange, Green) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Customers"
          value={data.totalCustomers?.toLocaleString()}
          subtext="Verified telecom subscribers"
          icon={Users}
          color="blue"
          trend={12.4}
          trendLabel="vs last month"
        />

        <DashboardCard
          title="Active Connections"
          value={data.activeConnections?.toLocaleString()}
          subtext="Active 5G/4G MSISDN lines"
          icon={Radio}
          color="emerald"
          trend={8.2}
          trendLabel="SIM net adds"
        />

        <DashboardCard
          title="Total Billed Amount"
          value={formatINR(data.totalBilledAmount)}
          subtext="Invoiced across all circles"
          icon={Receipt}
          color="amber"
          trend={15.1}
          trendLabel="QoQ growth"
        />

        <DashboardCard
          title="Payments Received"
          value={formatINR(data.paymentsReceived)}
          subtext="Settled collections (94% recovery)"
          icon={CreditCard}
          color="emerald"
          trend={9.5}
          trendLabel="via UPI / Bank"
        />
      </div>

      {/* Row 2: Operational & SLA Service Desk Metrics (Orange, Green, Orange, Red) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="New Leads Funnel"
          value={data.newLeads}
          subtext="Fresh incoming inquiries"
          icon={Kanban}
          color="amber"
          trend={18.0}
        />

        <DashboardCard
          title="Converted Leads"
          value={data.convertedLeads}
          subtext="Subscribers onboarded"
          icon={CheckCircle2}
          color="emerald"
          trend={22.5}
        />

        <DashboardCard
          title="Open Complaints"
          value={data.openComplaints}
          subtext="Service requests in queue"
          icon={AlertCircle}
          color="amber"
          trend={-4.2}
          trendLabel="reduced backlog"
        />

        <DashboardCard
          title="Overdue Invoices"
          value={data.overdueInvoices}
          subtext={`Outstanding: ${formatINR(data.outstandingAmount)}`}
          icon={Clock}
          color="rose"
          trend={-2.1}
        />
      </div>

      {/* Charts Grid: Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Registrations Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subscriber & SIM Onboarding Growth</h3>
              <p className="text-xs text-slate-500">Monthly new customer registrations and active SIM additions</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Last 6 Months</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRegistrations}>
                <defs>
                  <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorConn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="customers" name="Registered Customers" stroke="#2563EB" fillOpacity={1} fill="url(#colorCust)" strokeWidth={2} />
                <Area type="monotone" dataKey="connections" name="Active Connections" stroke="#10B981" fillOpacity={1} fill="url(#colorConn)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue vs Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Billed vs Collections Settled</h3>
              <p className="text-xs text-slate-500">Monthly amounts reported in Lakhs INR (₹)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">FY 2026</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="L" />
                <Tooltip
                  formatter={(val) => [`₹ ${val} Lakhs`]}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="billed" name="Billed Revenue (₹ Lakhs)" fill="#F97316" radius={[6, 6, 0, 0]} />
                <Bar dataKey="collected" name="Settled Collections (₹ Lakhs)" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid: Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints by Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Complaints by Category</h3>
          <p className="text-xs text-slate-500 mb-4">Service desk ticket breakdown</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.complaintsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="category"
                >
                  {data.complaintsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {data.complaintsByCategory.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="truncate max-w-[160px]">{c.category}</span>
                </div>
                <span className="font-bold text-slate-800">{c.count} tickets</span>
              </div>
            ))}
          </div>
        </div>

        {/* Telecom Plan Popularity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Plan Popularity & Share</h3>
          <p className="text-xs text-slate-500 mb-4">Subscriber density by telecom tariff</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.planPopularity} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="plan" type="category" tick={{ fontSize: 9, fill: '#475569' }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="subscribers" name="Subscribers" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Executive Pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Sales Leaderboard</h3>
          <p className="text-xs text-slate-500 mb-4">Lead conversion and deal values</p>

          <div className="space-y-3">
            {data.salesByExecutive.map((exec, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{exec.name}</h4>
                    <span className="text-[10px] text-slate-500">{exec.converted} converted accounts</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600">{formatINR(exec.pipelineValue)}</span>
                  <p className="text-[10px] text-slate-400">Pipeline Closed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
