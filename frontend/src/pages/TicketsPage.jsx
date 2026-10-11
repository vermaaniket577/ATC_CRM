import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  MessageSquare,
  UserCheck,
  Send,
  X,
  Phone,
  Radio,
  FileText
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { NotificationToast } from '../components/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const TicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Comment input state
  const [newComment, setNewComment] = useState('');
  const [isInternalOnly, setIsInternalOnly] = useState(true);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const [formData, setFormData] = useState({
    customerId: 1,
    connectionId: 1,
    category: 'NETWORK_COVERAGE',
    subject: '',
    description: '',
    priority: 'HIGH',
  });

  useEffect(() => {
    loadTickets();
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, currentPage]);

  const loadTickets = async () => {
    setLoading(true);
    const result = await crmApi.getTickets({
      query: searchQuery,
      status: statusFilter,
      priority: priorityFilter,
      category: categoryFilter,
      page: currentPage,
      size: 10,
    });
    setTickets(result.content || []);
    setTotalElements(result.totalElements || 0);
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await crmApi.createTicket(formData);
      setToastMessage(`Ticket ${created.ticketCode || ''} raised successfully with SLA target.`);
      setShowCreateModal(false);
      setFormData({
        customerId: 1,
        connectionId: 1,
        category: 'NETWORK_COVERAGE',
        subject: '',
        description: '',
        priority: 'HIGH',
      });
      loadTickets();
    } catch (err) {
      setToastMessage('Error creating ticket: ' + err.message);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedTicket) return;
    await crmApi.updateTicketStatus(selectedTicket.id, newStatus, resolutionNotes);
    setToastMessage(`Ticket status updated to ${newStatus}`);
    setSelectedTicket({ ...selectedTicket, ticketStatus: newStatus });
    loadTickets();
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      header: 'Ticket ID',
      accessor: 'ticketCode',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {row.ticketCode}
        </span>
      ),
    },
    {
      header: 'Subject & Category',
      accessor: 'subject',
      render: (row) => (
        <div className="max-w-xs">
          <div className="font-bold text-slate-900 text-xs truncate" title={row.subject}>{row.subject}</div>
          <div className="text-[10px] text-slate-400">{row.category?.replace(/_/g, ' ')}</div>
        </div>
      ),
    },
    {
      header: 'Subscriber',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-slate-800">{row.customerName}</div>
          <div className="font-mono text-[10px] text-slate-400">{row.customerPhone}</div>
        </div>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => <StatusBadge status={row.priority} />,
    },
    {
      header: 'Status',
      accessor: 'ticketStatus',
      render: (row) => <StatusBadge status={row.ticketStatus} />,
    },
    {
      header: 'SLA Target',
      accessor: 'slaDeadline',
      render: (row) => (
        <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          {formatDeadline(row.slaDeadline)}
        </span>
      ),
    },
    {
      header: 'Technician',
      accessor: 'assignedEmployeeName',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.assignedEmployeeName || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <button
          onClick={() => { setSelectedTicket(row); setShowDetailModal(true); }}
          className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Manage
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Complaints & SLA Service Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Resolve customer network disputes, fiber outages, and billing tickets within committed DoT SLA hours.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Ticket</span>
        </button>
      </div>

      {/* Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search ticket subject, subscriber name, or ID..."
        filters={[
          {
            label: 'Priority',
            value: priorityFilter,
            onChange: setPriorityFilter,
            options: [
              { label: 'Critical', value: 'CRITICAL' },
              { label: 'High', value: 'HIGH' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'Low', value: 'LOW' },
            ],
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Open', value: 'OPEN' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Resolved', value: 'RESOLVED' },
              { label: 'Closed', value: 'CLOSED' },
            ],
          },
          {
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { label: 'Network Coverage', value: 'NETWORK_COVERAGE' },
              { label: 'Billing Dispute', value: 'BILLING_DISPUTE' },
              { label: 'Broadband / Fiber', value: 'BROADBAND_FAULT' },
              { label: 'SIM Swap', value: 'SIM_SWAP' },
            ],
          },
        ]}
        onReset={() => { setSearchQuery(''); setStatusFilter(''); setPriorityFilter(''); setCategoryFilter(''); }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={tickets}
        loading={loading}
        emptyMessage="No tickets in queue"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      {/* Ticket Details & Resolution Modal */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedTicket.subject}</h3>
                  <span className="font-mono text-xs text-blue-600 font-bold">{selectedTicket.ticketCode}</span>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority</span>
                  <StatusBadge status={selectedTicket.priority} />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
                  <StatusBadge status={selectedTicket.ticketStatus} />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SLA Target</span>
                  <span className="font-semibold text-slate-800">{formatDeadline(selectedTicket.slaDeadline)}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Subscriber Description</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Resolution Actions */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                <span className="text-blue-900 font-bold block">Resolution & Workflow Actions</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('RESOLVED')}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('CLOSED')}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-colors shadow-sm"
                  >
                    Close Ticket
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Resolution Summary Notes</label>
                  <input
                    type="text"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    placeholder="Enter diagnostic actions, tower cell ID inspected, or customer resolution..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raise Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Raise Customer Incident</h3>
                  <p className="text-xs text-slate-500">Auto-calculates SLA deadline based on priority</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer ID *</label>
                  <input
                    type="number"
                    required
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority (Determines SLA) *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="CRITICAL">Critical (4h SLA)</option>
                    <option value="HIGH">High (12h SLA)</option>
                    <option value="MEDIUM">Medium (24h SLA)</option>
                    <option value="LOW">Low (48h SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Complaint Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="NETWORK_COVERAGE">Network & 5G Cellular Coverage</option>
                  <option value="BILLING_DISPUTE">Billing & Tariff Charge Dispute</option>
                  <option value="BROADBAND_FAULT">Optical Leased Line / Fiber Fault</option>
                  <option value="SIM_SWAP">SIM / eSIM Profile Activation Issue</option>
                  <option value="GENERAL_QUERY">General Service Request</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. 5G Carrier Aggregation failure in Sector 4"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="Subscriber symptoms, handset model, exact location coordinates..."
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
                  Log Ticket with SLA
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
