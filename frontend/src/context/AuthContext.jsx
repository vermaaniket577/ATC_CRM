import React, { createContext, useContext, useState, useEffect } from 'react';
import { crmApi } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('telecom_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default logged in user for immediate testing
    return {
      userId: 1,
      username: 'superadmin',
      fullName: 'Aakash Khurana (COO)',
      email: 'admin@apextelecom.in',
      roles: ['ROLE_SUPER_ADMIN']
    };
  });

  const [loading, setLoading] = useState(false);

  const login = async (username, password, requireMfa = false) => {
    setLoading(true);
    try {
      const data = await crmApi.login(username, password, requireMfa);
      if (data && data.mfaRequired) {
        return {
          success: false,
          mfaRequired: true,
          tempToken: data.tempToken,
          username: data.username,
          maskedPhone: data.maskedPhone,
          sandboxOtp: data.sandboxOtp
        };
      }
      const userData = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        fullName: data.fullName || data.username,
        roles: data.roles || ['ROLE_SUPER_ADMIN']
      };
      if (data.token) {
        localStorage.setItem('telecom_jwt_token', data.token);
      }
      localStorage.setItem('telecom_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (username, tempToken, otpCode) => {
    setLoading(true);
    try {
      const data = await crmApi.verifyOtp(username, tempToken, otpCode);
      const userData = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        fullName: data.fullName || data.username,
        roles: data.roles || ['ROLE_SUPER_ADMIN']
      };
      if (data.token) {
        localStorage.setItem('telecom_jwt_token', data.token);
      }
      localStorage.setItem('telecom_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message || 'OTP verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('telecom_jwt_token');
    localStorage.removeItem('telecom_user');
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes('ROLE_SUPER_ADMIN') || user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      verifyOtp,
      logout,
      hasRole,
      isSuperAdmin: () => user?.roles?.includes('ROLE_SUPER_ADMIN'),
      isManager: () => user?.roles?.includes('ROLE_CRM_MANAGER') || user?.roles?.includes('ROLE_SUPER_ADMIN'),
      isSales: () => user?.roles?.includes('ROLE_SALES_EXECUTIVE') || user?.roles?.includes('ROLE_SUPER_ADMIN'),
      isSupport: () => user?.roles?.includes('ROLE_SUPPORT_EXECUTIVE') || user?.roles?.includes('ROLE_SUPER_ADMIN'),
      isBilling: () => user?.roles?.includes('ROLE_BILLING_EXECUTIVE') || user?.roles?.includes('ROLE_SUPER_ADMIN'),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
