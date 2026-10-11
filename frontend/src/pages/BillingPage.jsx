import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  X,
  Receipt,
  FileText
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { NotificationToast } from '../components/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const BillingPage = () => {
  const { hasRole } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Invoice creation state
  const [newInvoiceData, setNewInvoiceData] = useState({
    customerId: 1,
    billingPeriodStart: '2026-09-01',
    billingPeriodEnd: '2026-09-30',
    dueDate: '2026-10-25',
    itemDescription: 'Monthly Subscription - Apex Platinum Postpaid Pro',
    unitPrice: 1199,
  });

  useEffect(() => {
    loadInvoices();
  }, [searchQuery, statusFilter, currentPage]);

  const loadInvoices = async () => {
    setLoading(true);
    const result = await crmApi.getInvoices({
      query: searchQuery,
      status: statusFilter,
      page: currentPage,
      size: 10,
    });
    setInvoices(result.content || []);
    setTotalElements(result.totalElements || 0);
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const handleOpenPay = (inv) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.outstandingAmount || inv.totalAmount);
    setShowPayModal(true);
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      const p = await crmApi.recordPayment({
        invoiceId: selectedInvoice.id,
        amount: Number(paymentAmount),
        paymentMethod,
        idempotencyKey: 'IDEMP-' + selectedInvoice.id + '-' + Date.now(),
        notes: paymentNotes,
      });
      setToastMessage(`Payment of ₹${paymentAmount} settled successfully via ${paymentMethod}!`);
      setShowPayModal(false);
      loadInvoices();
    } catch (err) {
      setToastMessage('Payment recording failed: ' + err.message);
    }
  };

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await crmApi.createInvoice({
        customerId: newInvoiceData.customerId,
        billingPeriodStart: newInvoiceData.billingPeriodStart,
        billingPeriodEnd: newInvoiceData.billingPeriodEnd,
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: newInvoiceData.dueDate,
        items: [
          {
            description: newInvoiceData.itemDescription,
            quantity: 1,
            unitPrice: Number(newInvoiceData.unitPrice),
            taxRatePercent: 18.00,
          }
        ]
      });
      setToastMessage('Invoice generated with 18% GST calculation!');
      setShowCreateModal(false);
      loadInvoices();
    } catch (err) {
      setToastMessage('Error generating invoice: ' + err.message);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  const columns = [
    {
      header: 'Invoice Number',
      accessor: 'invoiceNumber',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Subscriber',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{row.customerName}</div>
          <div className="font-mono text-[10px] text-slate-400">{row.customerMobile}</div>
        </div>
      ),
    },
    {
      header: 'Invoice Date',
      accessor: 'invoiceDate',
      render: (row) => <span className="text-xs text-slate-600">{row.invoiceDate}</span>,
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => (
        <span className={`text-xs font-medium ${row.status === 'OVERDUE' ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
          {row.dueDate}
        </span>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-bold text-xs text-slate-900">{formatINR(row.totalAmount)}</span>
      ),
    },
    {
      header: 'Outstanding Balance',
      accessor: 'outstandingAmount',
      render: (row) => (
        <span className={`font-extrabold text-xs ${Number(row.outstandingAmount) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
          {formatINR(row.outstandingAmount)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Billing Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setSelectedInvoice(row); setShowPrintModal(true); }}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View & Print Tax Invoice"
          >
            <Printer className="w-4 h-4" />
          </button>

          {row.status !== 'PAID' && hasRole('ROLE_BILLING_EXECUTIVE') && (
            <button
              onClick={() => handleOpenPay(row)}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Collect
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
            Billing & Payment Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate itemized telecom tax invoices with 18% GST and verify NPCI UPI / NetBanking payments.
          </p>
        </div>

        {hasRole('ROLE_BILLING_EXECUTIVE') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        )}
      </div>

      {/* Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search invoice number or subscriber..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Paid', value: 'PAID' },
              { label: 'Unpaid', value: 'UNPAID' },
              { label: 'Overdue', value: 'OVERDUE' },
            ],
          },
        ]}
        onReset={() => { setSearchQuery(''); setStatusFilter(''); }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={invoices}
        loading={loading}
        emptyMessage="No invoices matching search parameters"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      {/* Record Payment Modal */}
      {showPayModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Settlement Payment</h3>
                  <p className="text-xs text-slate-500">Invoice: {selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="mt-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Subscriber</span>
                  <p className="font-bold text-slate-800">{selectedInvoice.customerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Outstanding</span>
                  <p className="font-extrabold text-sm text-rose-600">{formatINR(selectedInvoice.outstandingAmount)}</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collection Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Settlement Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="UPI">UPI (NPCI QR / VPA)</option>
                  <option value="NET_BANKING">NetBanking / NEFT / RTGS</option>
                  <option value="CREDIT_CARD">Credit Card Gateway</option>
                  <option value="DEBIT_CARD">Debit Card POS</option>
                  <option value="CASH_COUNTER">Retail Store Cash Counter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Reference / UTR</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs"
                  placeholder="e.g. UPI-UTR-20261011-8849"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md shadow-emerald-500/20"
                >
                  Confirm & Post Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Tax Invoice Modal */}
      {showPrintModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">TAX INVOICE</h2>
                <p className="text-xs text-slate-500">Apex Telecom India Limited • GSTIN: 27AAACA1234F1Z8</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-blue-600">{selectedInvoice.invoiceNumber}</span>
                <p className="text-xs text-slate-400">Date: {selectedInvoice.invoiceDate}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Billed To</span>
                <h4 className="font-bold text-slate-900 mt-1">{selectedInvoice.customerName}</h4>
                <p className="text-slate-600 font-mono mt-0.5">{selectedInvoice.customerMobile}</p>
                <p className="text-slate-500 mt-1">{selectedInvoice.customerAddress || 'BKC Circle, Mumbai - 400051'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Billing Period</span>
                <p className="font-medium text-slate-800 mt-1">{selectedInvoice.billingPeriodStart} to {selectedInvoice.billingPeriodEnd}</p>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mt-2">Due Date</span>
                <p className="font-bold text-slate-900">{selectedInvoice.dueDate}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Item Description</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Taxable Value</th>
                    <th className="px-3 py-2 text-right">GST (18%)</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-medium text-slate-800">{it.description}</td>
                      <td className="px-3 py-2 text-center">{it.quantity}</td>
                      <td className="px-3 py-2 text-right font-mono">₹{it.unitPrice}</td>
                      <td className="px-3 py-2 text-right font-mono text-slate-500">18.00%</td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">₹{it.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Totals */}
            <div className="mt-4 flex justify-end text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">₹{selectedInvoice.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (9%) + SGST (9%):</span>
                  <span className="font-mono font-semibold">₹{selectedInvoice.taxAmount}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="font-mono text-blue-600">{formatINR(selectedInvoice.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Computer generated tax invoice • Valid without signature</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 brand-gradient text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Generate Telecom Invoice</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Account ID *</label>
                <input
                  type="number"
                  required
                  value={newInvoiceData.customerId}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customerId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Line Item Description *</label>
                <input
                  type="text"
                  required
                  value={newInvoiceData.itemDescription}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, itemDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newInvoiceData.unitPrice}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newInvoiceData.dueDate}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-900">
                Note: Standard 18% GST (9% CGST + 9% SGST) is automatically computed on the backend.
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
                  Generate Tax Statement
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
