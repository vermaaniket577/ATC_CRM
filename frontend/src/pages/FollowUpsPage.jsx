import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Calendar,
  X,
  ListTodo
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { StatusBadge } from '../components/StatusBadge';
import { NotificationToast } from '../components/NotificationToast';

export const FollowUpsPage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('followups'); // 'followups' or 'tasks'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    assignedEmployeeId: 3,
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    priority: 'HIGH',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [f, t] = await Promise.all([
      crmApi.getFollowUps(),
      crmApi.getTasks(),
    ]);
    setFollowUps(f || []);
    setTasks(t || []);
    setLoading(false);
  };

  const handleCompleteFollowUp = async (id) => {
    await crmApi.createFollowUp({ id }); // or patch
    setToastMessage('Follow-up marked as completed!');
    loadData();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await crmApi.createFollowUp(formData);
      setToastMessage('Scheduled follow-up created!');
      setShowCreateModal(false);
      loadData();
    } catch (err) {
      setToastMessage('Error: ' + err.message);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Follow-Ups & Action Items
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Staff action items, renewal calls, RF field site visits, and scheduled customer check-ins.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 brand-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Action</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('followups')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'followups'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Client Follow-Ups ({followUps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>Field & Operations Tasks ({tasks.length})</span>
        </button>
      </div>

      {/* List Container */}
      <div className="space-y-3">
        {activeTab === 'followups' ? (
          followUps.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <StatusBadge status={item.priority} />
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Related to: <span className="font-semibold text-slate-700">{item.leadName || item.customerName || 'General Account'}</span>
                  </p>
                  {item.notes && (
                    <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {formatDate(item.scheduledAt)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Assignee: {item.assignedEmployeeName}
                  </div>
                </div>

                {item.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleCompleteFollowUp(item.id)}
                    className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                    title="Mark Done"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <ListTodo className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {task.taskCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                    <StatusBadge status={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Due: {formatDate(task.dueDate)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Owner: {task.assignedEmployeeName}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Schedule Client Follow-Up</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title / Meeting Agenda *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g. Contract SLA renewal discussion"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheduled Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
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
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="Items to prepare, contract clauses, previous action points..."
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
                  Save Schedule
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
