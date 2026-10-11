import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Archive,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  CheckCircle,
  X,
  Radio
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { NotificationToast } from '../components/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const CustomersPage = () => {
  const { hasRole } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals & Toast State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [archiveTarget, setArchiveTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '+91 ',
    alternatePhone: '',
    email: '',
    customerType: 'INDIVIDUAL',
    companyName: '',
    category: 'STANDARD',
    acquisitionSource: 'ONLINE',
    addressLine1: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    internalRemarks: '',
  });

  useEffect(() => {
    loadCustomers();
  }, [searchQuery, statusFilter, typeFilter, currentPage]);

  const loadCustomers = async () => {
    setLoading(true);
    const result = await crmApi.getCustomers({
      query: searchQuery,
      status: statusFilter,
      type: typeFilter,
      page: currentPage,
      size: 10,
    });
    setCustomers(result.content || []);
    setTotalElements(result.totalElements || 0);
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await crmApi.createCustomer(formData);
      setToastMessage(`Customer ${created.customerCode || 'record'} registered successfully!`);
      setToastType('success');
      setShowCreateModal(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        mobileNumber: '+91 ',
        alternatePhone: '',
        email: '',
        customerType: 'INDIVIDUAL',
        companyName: '',
        category: 'STANDARD',
        acquisitionSource: 'ONLINE',
        addressLine1: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001',
        internalRemarks: '',
      });
      loadCustomers();
    } catch (err) {
      setToastMessage('Error creating customer: ' + err.message);
      setToastType('error');
    }
  };

  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;
    await crmApi.updateCustomerStatus(archiveTarget.id, 'ARCHIVED');
    setToastMessage(`Customer ${archiveTarget.customerCode} archived.`);
    setArchiveTarget(null);
    loadCustomers();
  };

  const handleExportCsv = () => {
    window.open('/api/v1/reports/export/csv?type=customers', '_blank');
    setToastMessage('Exporting customer dataset to CSV...');
  };

  // Mask sensitive PII for non-admin viewers
  const maskPhone = (phone) => {
    if (!phone) return '-';
    if (hasRole('ROLE_SUPER_ADMIN') || hasRole('ROLE_CRM_MANAGER')) return phone;
    // Mask middle digits: +91 98201 XXXXX
    return phone.replace(/(\+91\s?\d{4})\d{6}/, '$1 XXXXX');
  };

  const columns = [
    {
      header: 'Customer ID',
      accessor: 'customerCode',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {row.customerCode}
        </span>
      ),
    },
    {
      header: 'Subscriber Name',
      accessor: 'fullName',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{row.displayName || row.fullName}</div>
          <div className="text-[10px] text-slate-400">{row.email || 'No email registered'}</div>
        </div>
      ),
    },
    {
      header: 'Mobile Number',
      accessor: 'mobileNumber',
      render: (row) => (
        <span className="font-mono text-xs text-slate-700 flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-slate-400" />
          {maskPhone(row.mobileNumber)}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: 'customerType',
      render: (row) => <StatusBadge status={row.customerType} />,
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => <StatusBadge status={row.category} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'City / Circle',
      accessor: 'primaryAddress',
      render: (row) => (
        <span className="text-xs text-slate-600 truncate max-w-[180px] block" title={row.primaryAddress}>
          {row.primaryAddress ? row.primaryAddress.split(',')[1] || row.primaryAddress : 'Mumbai Metro'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setSelectedCustomer(row); setShowDetailModal(true); }}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details & History"
          >
            <Eye className="w-4 h-4" />
          </button>
          {hasRole('ROLE_CRM_MANAGER') && (
            <button
              onClick={() => setArchiveTarget(row)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Archive Record"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Subscriber & Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage individual and corporate subscribers, address verification, and KYC statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Customer</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by name, customer ID, or phone number..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Suspended', value: 'SUSPENDED' },
              { label: 'Archived', value: 'ARCHIVED' },
            ],
          },
          {
            label: 'Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { label: 'Individual', value: 'INDIVIDUAL' },
              { label: 'Business / Enterprise', value: 'BUSINESS' },
            ],
          },
        ]}
        onReset={() => { setSearchQuery(''); setStatusFilter(''); setTypeFilter(''); }}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        emptyMessage="No customer records matched your query"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">New Customer Registration</h3>
                  <p className="text-xs text-slate-500">Provide verified KYC subscriber information</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Rahul"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Verma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number (MSISDN) *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="+91 98200 XXXXX"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alternate Phone</label>
                  <input
                    type="text"
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="+91 22 2345 XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="rahul@domain.in"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Type</label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business / Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="VIP">VIP Subscriber</option>
                    <option value="CORPORATE">Corporate Fleet</option>
                  </select>
                </div>
              </div>

              {formData.customerType === 'BUSINESS' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Legal Entity Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. CloudScale Technologies Pvt Ltd"
                  />
                </div>
              )}

              {/* Address details */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 mb-1">Billing / Installation Address</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 mb-2"
                  placeholder="Street / Building / Floor"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Remarks</label>
                <textarea
                  rows="2"
                  value={formData.internalRemarks}
                  onChange={(e) => setFormData({ ...formData, internalRemarks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  placeholder="Notes on subscriber preferences or corporate plan arrangements..."
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
                  Save & Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Customer Details Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCustomer.displayName || selectedCustomer.fullName}</h3>
                  <span className="font-mono text-xs text-blue-600 font-bold">{selectedCustomer.customerCode}</span>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Contact</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">{selectedCustomer.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Status</span>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Type</span>
                  <span className="font-semibold text-slate-800">{selectedCustomer.customerType} ({selectedCustomer.category})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Key Account Rep</span>
                  <span className="font-semibold text-slate-800">{selectedCustomer.assignedEmployeeName || 'Corporate Pool'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Billing Address</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedCustomer.primaryAddress || 'No permanent address recorded'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Internal Notes</span>
                <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedCustomer.internalRemarks || 'Standard DoT KYC verified subscriber.'}
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(archiveTarget)}
        title="Archive Customer Record"
        message={`Are you sure you want to archive subscriber ${archiveTarget?.customerCode} (${archiveTarget?.fullName})? The subscriber will be flagged as inactive.`}
        isDanger={true}
        confirmText="Archive Customer"
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveTarget(null)}
      />

      {/* Notification Toast */}
      <NotificationToast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};
