import React, { useState, useEffect } from 'react';
import {
  Radio,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  Layers,
  Smartphone,
  Phone,
  X,
  CreditCard
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { NotificationToast } from '../components/NotificationToast';

export const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [formData, setFormData] = useState({
    customerId: 1,
    mobileNumber: '+91 98200 ',
    simIccid: '899100100',
    connectionType: 'POSTPAID',
    operatorBrand: 'Apex Telecom',
    planId: 2,
    connectionStatus: 'ACTIVE',
    kycStatus: 'VERIFIED',
    notes: '',
  });

  useEffect(() => {
    loadConnections();
    loadPlans();
  }, [searchQuery, statusFilter, typeFilter, currentPage]);

  const loadConnections = async () => {
    setLoading(true);
    const result = await crmApi.getConnections({
      query: searchQuery,
      status: statusFilter,
      type: typeFilter,
      page: currentPage,
      size: 10,
    });
    setConnections(result.content || []);
    setTotalElements(result.totalElements || 0);
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const loadPlans = async () => {
    const p = await crmApi.getPlans();
    setPlans(p || []);
  };

  const handleStatusChange = async (id, newStatus) => {
    await crmApi.updateConnectionStatus(id, newStatus);
    setToastMessage(`Connection status changed to ${newStatus}`);
    setToastType('success');
    loadConnections();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await crmApi.createConnection(formData);
      setToastMessage(`Connection ${created.connectionCode || ''} provisioned successfully!`);
      setToastType('success');
      setShowCreateModal(false);
      loadConnections();
    } catch (err) {
      setToastMessage('Error provisioning connection: ' + err.message);
      setToastType('error');
    }
  };

  const columns = [
    {
      header: 'Connection Code',
      accessor: 'connectionCode',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {row.connectionCode}
        </span>
      ),
    },
    {
      header: 'Mobile MSISDN',
      accessor: 'mobileNumber',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-blue-500" />
          {row.mobileNumber}
        </span>
      ),
    },
    {
      header: 'Subscriber',
      accessor: 'customerName',
      render: (row) => <span className="font-medium text-xs text-slate-800">{row.customerName}</span>,
    },
    {
      header: 'SIM ICCID',
      accessor: 'simIccid',
      render: (row) => (
        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
          {row.simIccid}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: 'connectionType',
      render: (row) => <StatusBadge status={row.connectionType} />,
    },
    {
      header: 'Plan Subscribed',
      accessor: 'planName',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px] block" title={row.planName}>
          {row.planName || 'Apex Standard 5G'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'connectionStatus',
      render: (row) => <StatusBadge status={row.connectionStatus} />,
    },
    {
      header: 'KYC Status',
      accessor: 'kycStatus',
      render: (row) => <StatusBadge status={row.kycStatus} />,
    },
    {
      header: 'Lifecycle Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.connectionStatus === 'ACTIVE' ? (
            <button
              onClick={() => handleStatusChange(row.id, 'SUSPENDED')}
              className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange(row.id, 'ACTIVE')}
              className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              Activate
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
            Telecom Connections & SIM Lifecycle
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provision eSIM profiles, physical 5G SIM cards, track renewals, and manage DoT KYC activations.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Connection</span>
        </button>
      </div>

      {/* Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by MSISDN, ICCID, or Subscriber name..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Suspended', value: 'SUSPENDED' },
              { label: 'Deactivated', value: 'DEACTIVATED' },
            ],
          },
          {
            label: 'Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { label: 'Prepaid', value: 'PREPAID' },
              { label: 'Postpaid', value: 'POSTPAID' },
            ],
          },
        ]}
        onReset={() => { setSearchQuery(''); setStatusFilter(''); setTypeFilter(''); }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={connections}
        loading={loading}
        emptyMessage="No telecom connections matching the specified parameters"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      {/* Provision Connection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Provision New Connection</h3>
                  <p className="text-xs text-slate-500">Allocate MSISDN and link SIM ICCID</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Account ID *</label>
                <input
                  type="number"
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile MSISDN *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="+91 98200 12345"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SIM ICCID Reference *</label>
                  <input
                    type="text"
                    required
                    value={formData.simIccid}
                    onChange={(e) => setFormData({ ...formData, simIccid: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="89910010012345678916"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Connection Type</label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="PREPAID">Prepaid</option>
                    <option value="POSTPAID">Postpaid</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Tariff Plan</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">KYC Verification Status</label>
                <select
                  value={formData.kycStatus}
                  onChange={(e) => setFormData({ ...formData, kycStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="VERIFIED">Verified (UIDAI / Aadhaar eKYC)</option>
                  <option value="PENDING">Pending Verification</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Device / SIM Notes</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. eSIM QR dispatched via registered email"
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
                  Provision SIM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      <NotificationToast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};
