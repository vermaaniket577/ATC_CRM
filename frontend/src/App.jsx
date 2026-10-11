import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { PlansPage } from './pages/PlansPage';
import { LeadsPage } from './pages/LeadsPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { TicketsPage } from './pages/TicketsPage';
import { BillingPage } from './pages/BillingPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { BranchesPage } from './pages/BranchesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Route guards
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="followups" element={<FollowUpsPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
