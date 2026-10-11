import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Zap,
  Check,
  Shield,
  Smartphone,
  Globe,
  Radio,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { StatusBadge } from '../components/StatusBadge';
import { NotificationToast } from '../components/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const PlansPage = () => {
  const { hasRole } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    planType: 'POSTPAID',
    price: 599,
    validityDays: 30,
    dataGbPerDay: 2.0,
    voiceBenefit: 'Truly Unlimited All-India',
    smsPerDay: 100,
    roamingBenefit: 'Free National Roaming',
    additionalBenefits: 'Free 5G True Speed, OTT Entertainment subscription',
    is5gEnabled: true,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const result = await crmApi.getPlans();
    setPlans(result || []);
    setLoading(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await crmApi.createPlan(formData);
      setToastMessage(`Plan ${created.name} added to catalog!`);
      setShowCreateModal(false);
      loadPlans();
    } catch (err) {
      setToastMessage('Error creating plan: ' + err.message);
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.planType === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Telecom Tariff & Plan Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure prepaid packs, corporate postpaid subscriptions, high-speed fiber leases, and 5G entitlements.
          </p>
        </div>

        {hasRole('ROLE_CRM_MANAGER') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['ALL', 'PREPAID', 'POSTPAID', 'ENTERPRISE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab === 'ALL' ? 'All Plans' : tab}
          </button>
        ))}
      </div>

      {/* Plans Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 card-hover flex flex-col justify-between relative overflow-hidden"
          >
            {plan.is5gEnabled && (
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                <Zap className="w-3 h-3 text-cyan-500 fill-cyan-500" />
                TRUE 5G
              </div>
            )}

            <div>
              <div className="mb-2">
                <StatusBadge status={plan.planType} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{plan.name}</h3>
              <p className="font-mono text-xs text-slate-400">{plan.planCode}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">₹{plan.price}</span>
                <span className="text-xs text-slate-500 font-medium">/ {plan.validityDays} days</span>
              </div>

              {/* Feature Checklist */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    {plan.dataGbPerDay > 0 ? `${plan.dataGbPerDay} GB/Day High-Speed Data` : 'Unlimited Leased Bandwidth'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{plan.voiceBenefit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{plan.smsPerDay} SMS/Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{plan.roamingBenefit}</span>
                </div>
              </div>

              {plan.additionalBenefits && (
                <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700 block mb-0.5">Value Add-ons:</span>
                  {plan.additionalBenefits}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Status: Active</span>
              <span className="text-blue-600 font-bold hover:underline cursor-pointer">View Tariff Spec</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Telecom Tariff Plan</h3>
                  <p className="text-xs text-slate-500">Publish new commercial package to subscriber catalog</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Commercial Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g. Apex 5G Prime 365 Days"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type *</label>
                  <select
                    value={formData.planType}
                    onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="PREPAID">Prepaid</option>
                    <option value="POSTPAID">Postpaid</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Validity (Days) *</label>
                  <input
                    type="number"
                    required
                    value={formData.validityDays}
                    onChange={(e) => setFormData({ ...formData, validityDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data (GB/Day)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.dataGbPerDay}
                    onChange={(e) => setFormData({ ...formData, dataGbPerDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Voice Calling Benefits</label>
                  <input
                    type="text"
                    value={formData.voiceBenefit}
                    onChange={(e) => setFormData({ ...formData, voiceBenefit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Additional Benefits & OTT</label>
                <input
                  type="text"
                  value={formData.additionalBenefits}
                  onChange={(e) => setFormData({ ...formData, additionalBenefits: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. Disney+ Hotstar 1Y, Amazon Prime, Rollover"
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
                  Publish Tariff Plan
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
