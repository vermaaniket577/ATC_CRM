import React, { useState, useEffect } from 'react';
import {
  Kanban,
  Table,
  Plus,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  Building,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  X,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { StatusBadge } from '../components/StatusBadge';
import { NotificationToast } from '../components/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const LeadsPage = () => {
  const { hasRole } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [convertingLead, setConvertingLead] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    prospectName: '',
    mobileNumber: '+91 ',
    email: '',
    companyName: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    leadSource: 'WEBSITE',
    interestedService: '5G Postpaid Corporate',
    estimatedValue: 100000,
    priority: 'MEDIUM',
    notes: '',
  });

  const KANBAN_STAGES = [
    { key: 'NEW', title: 'New Leads', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
    { key: 'CONTACTED', title: 'Contacted', color: 'border-cyan-400 bg-cyan-50/40 text-cyan-800' },
    { key: 'QUALIFIED', title: 'Qualified', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
    { key: 'PROPOSAL_SENT', title: 'Proposal Sent', color: 'border-purple-400 bg-purple-50/40 text-purple-800' },
    { key: 'NEGOTIATION', title: 'Negotiation', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
    { key: 'CONVERTED', title: 'Converted', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' },
  ];

  useEffect(() => {
    loadLeads();
  }, [searchQuery, statusFilter, priorityFilter]);

  const loadLeads = async () => {
    setLoading(true);
    const result = await crmApi.getLeads({
      query: searchQuery,
      status: statusFilter,
      priority: priorityFilter,
      size: 50,
    });
    setLeads(result.content || []);
    setLoading(false);
  };

  const handleStageChange = async (leadId, newStage) => {
    await crmApi.updateLeadStatus(leadId, newStage);
    setToastMessage(`Lead moved to ${newStage}`);
    loadLeads();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await crmApi.createLead(formData);
      setToastMessage(`Lead ${created.leadCode || ''} added to pipeline!`);
      setShowCreateModal(false);
      loadLeads();
    } catch (err) {
      setToastMessage('Error creating lead: ' + err.message);
    }
  };

  const handleConvertLead = async (lead) => {
    try {
      await crmApi.convertLead(lead.id, {
        customerType: lead.companyName ? 'BUSINESS' : 'INDIVIDUAL',
        category: 'CORPORATE'
      });
      setToastMessage(`Lead ${lead.leadCode} converted into subscriber!`);
      setConvertingLead(null);
      loadLeads();
    } catch (err) {
      setToastMessage('Conversion error: ' + err.message);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const columns = [
    {
      header: 'Lead Code',
      accessor: 'leadCode',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {row.leadCode}
        </span>
      ),
    },
    {
      header: 'Prospect / Entity',
      accessor: 'prospectName',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{row.prospectName}</div>
          <div className="text-[10px] text-slate-400">{row.companyName || 'Individual Deal'}</div>
        </div>
      ),
    },
    {
      header: 'Mobile',
      accessor: 'mobileNumber',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.mobileNumber}</span>,
    },
    {
      header: 'Deal Value',
      accessor: 'estimatedValue',
      render: (row) => (
        <span className="font-bold text-xs text-emerald-700">{formatINR(row.estimatedValue)}</span>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => <StatusBadge status={row.priority} />,
    },
    {
      header: 'Stage',
      accessor: 'leadStatus',
      render: (row) => <StatusBadge status={row.leadStatus} />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.leadStatus !== 'CONVERTED' && (
            <button
              onClick={() => handleConvertLead(row)}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Convert
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Sales Pipeline & Lead Funnel
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track B2B enterprise deals, SIM fleet opportunities, and conversion pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Kanban / Table Toggle */}
          <div className="bg-slate-200 p-0.5 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search prospect name, company, or mobile..."
        filters={[
          {
            label: 'Priority',
            value: priorityFilter,
            onChange: setPriorityFilter,
            options: [
              { label: 'Urgent', value: 'URGENT' },
              { label: 'High', value: 'HIGH' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'Low', value: 'LOW' },
            ],
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: KANBAN_STAGES.map(s => ({ label: s.title, value: s.key })),
          },
        ]}
        onReset={() => { setSearchQuery(''); setStatusFilter(''); setPriorityFilter(''); }}
      />

      {/* View: Kanban vs Table */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((stage) => {
            const stageLeads = leads.filter(l => l.leadStatus === stage.key);
            const stageTotalValue = stageLeads.reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);

            return (
              <div
                key={stage.key}
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-w-[220px]"
              >
                {/* Stage Header */}
                <div className={`p-2 rounded-xl border mb-3 flex items-center justify-between ${stage.color}`}>
                  <span className="font-bold text-xs">{stage.title}</span>
                  <span className="w-5 h-5 rounded-full bg-white/80 font-bold text-[11px] flex items-center justify-center shadow-xs">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="text-[10px] font-semibold text-slate-500 px-1 mb-2">
                  Total: {formatINR(stageTotalValue)}
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm card-hover relative"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono font-bold text-blue-600">{lead.leadCode}</span>
                        <StatusBadge status={lead.priority} />
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 mt-1">{lead.prospectName}</h4>
                      {lead.companyName && (
                        <p className="text-[11px] font-medium text-slate-500 truncate">{lead.companyName}</p>
                      )}

                      <div className="mt-2 text-xs font-extrabold text-emerald-600">
                        {formatINR(lead.estimatedValue)}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">{lead.mobileNumber}</span>
                        {lead.leadStatus !== 'CONVERTED' ? (
                          <button
                            onClick={() => handleConvertLead(lead)}
                            className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-2 py-0.5 rounded border border-emerald-200"
                          >
                            Convert →
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" /> Converted
                          </span>
                        )}
                      </div>

                      {/* Stage Transition Selector */}
                      <div className="mt-2">
                        <select
                          value={lead.leadStatus}
                          onChange={(e) => handleStageChange(lead.id, e.target.value)}
                          className="w-full text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-600 font-medium focus:outline-none"
                        >
                          {KANBAN_STAGES.map(s => (
                            <option key={s.key} value={s.key}>Move to: {s.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No deals in {stage.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={leads}
          loading={loading}
          emptyMessage="No leads found"
        />
      )}

      {/* Add Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Kanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Sales Opportunity</h3>
                  <p className="text-xs text-slate-500">Register potential telecom contract or subscriber line</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.prospectName}
                    onChange={(e) => setFormData({ ...formData, prospectName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Ramesh Chandak"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="+91 98200 XXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. Chandak Exports"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deal Value (₹)</label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interested Telecom Service</label>
                <input
                  type="text"
                  value={formData.interestedService}
                  onChange={(e) => setFormData({ ...formData, interestedService: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. 50 Corporate Postpaid Lines + Leased Fiber"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opportunity Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="Customer requirements, competitor pricing, timeline..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 brand-gradient text-white rounded-lg font-bold shadow-md shadow-blue-500/20 hover:opacity-95"
                >
                  Save Lead Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};
