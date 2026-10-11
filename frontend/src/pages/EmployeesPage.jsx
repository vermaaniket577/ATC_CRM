import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Mail,
  Phone,
  Building,
  Shield,
  Briefcase
} from 'lucide-react';
import { crmApi } from '../api/apiClient';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmApi.getEmployees().then((data) => {
      setEmployees(data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      header: 'Code',
      accessor: 'employeeCode',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {row.employeeCode}
        </span>
      ),
    },
    {
      header: 'Staff Member',
      accessor: 'firstName',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{row.firstName} {row.lastName}</div>
          <div className="text-[10px] text-slate-400">{row.designation}</div>
        </div>
      ),
    },
    {
      header: 'Work Email',
      accessor: 'workEmail',
      render: (row) => (
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          {row.workEmail}
        </span>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.department}
        </span>
      ),
    },
    {
      header: 'Circle Branch',
      accessor: 'branch',
      render: (row) => (
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          {row.branch?.name || 'Pan-India HQ'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'employmentStatus',
      render: (row) => <StatusBadge status={row.employmentStatus} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Telecom Staff & Roles Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Department hierarchy across Operations, Key Account Sales, Customer Care, and Field RF Engineers.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        emptyMessage="No employees found"
      />
    </div>
  );
};
