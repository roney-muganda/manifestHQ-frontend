// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AppShell } from '@/components/layout/AppShell';
import { ToastContainer } from '@/components/ui/Toast';

// Note: These imports will show TS errors until we create the files!
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { VerifyEmail } from '@/pages/auth/VerifyEmail';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

import { Dashboard } from '@/pages/dashboard/Dashboard';
import { ShipmentList } from '@/pages/shipments/ShipmentList';
import { ShipmentDetail } from '@/pages/shipments/ShipmentDetail';
import { NewShipment } from '@/pages/shipments/NewShipment';
import { Calculator } from '@/pages/calculator/Calculator';
import { Settings } from '@/pages/settings/Settings';
import { MerchantPortal } from '@/pages/portal/MerchantPortal';
import { NotFound } from '@/pages/NotFound';
import { Notifications } from '@/pages/notifications/Notifications';
import { Landing } from '@/pages/landing/Landing';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, fetchMe } = useAuthStore();
  
  // Lazy initialize: If no token exists, or we are already authed, we are done checking.
  const [checked, setChecked] = useState(() => {
    const token = localStorage.getItem('access_token');
    return !token || isAuthenticated;
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    // Only run the async fetch if we have a token but aren't authenticated yet
    if (token && !isAuthenticated) {
      fetchMe()
        .catch(() => {})
        .finally(() => setChecked(true));
    }
  }, [isAuthenticated, fetchMe]);

  if (!checked) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasToken = !!localStorage.getItem('access_token');
  if (!hasToken) return <Navigate to="/login" replace />;

  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public marketing / tool */}
        <Route path="/" element={<Landing />} />
        <Route path="/calculator" element={<Calculator />} />

        {/* Public merchant portal — no auth */}
        <Route path="/portal/:token" element={<MerchantPortal />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected agent app */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/shipments" element={<ProtectedRoute><ShipmentList /></ProtectedRoute>} />
        <Route path="/shipments/new" element={<ProtectedRoute><NewShipment /></ProtectedRoute>} />
        <Route path="/shipments/:id" element={<ProtectedRoute><ShipmentDetail /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/app/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        <Route
          path="/notifications"
          element={<ProtectedRoute><Notifications /></ProtectedRoute>}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}