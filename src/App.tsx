import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';

// User Pages
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';

import AddressesPage from './pages/AddressesPage';
import PaymentsPage from './pages/PaymentsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import FoodManagementPage from './pages/admin/FoodManagementPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UsersPage from './pages/admin/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';

// Layout Components
import Layout from './components/layout/Layout';
import OrdersPage from './pages/OrdersPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'USER' | 'ADMIN' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, portalType, isLoading } = useAuth();

  console.log('ProtectedRoute:', { isAuthenticated, userRole: user?.role, portalType, isLoading, requiredRole });

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skorange"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on portal type
    if (portalType === 'admin') {
      return <Navigate to="/admin/login" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on portal type
    if (portalType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Layout>{children}</Layout>;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode; portalType?: 'user' | 'admin' }> = ({ children, portalType }) => {
  const { isAuthenticated, portalType: authPortalType, isLoading } = useAuth();

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skorange"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect based on portal type
    if (authPortalType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

function RootRedirect() {
  const { isAuthenticated, portalType, isLoading } = useAuth();

  console.log('RootRedirect:', { isAuthenticated, portalType, isLoading });

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skorange"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (portalType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Navigate to="/login" replace />;
}

function FallbackRedirect() {
  const { portalType, isLoading } = useAuth();
  
  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skorange"></div>
      </div>
    );
  }
  
  if (portalType === 'admin') {
    return <Navigate to="/admin/login" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

function AppRoutes() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#FF6F1F',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 4px 24px 0 rgba(255, 111, 31, 0.08)',
          },
          iconTheme: {
            primary: '#FF6F1F',
            secondary: '#E6F4E6',
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-white via-skgreen to-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute portalType="user">
              <LoginPage portalType="user" />
            </PublicRoute>
          } />
          <Route path="/admin/login" element={
            <PublicRoute portalType="admin">
              <LoginPage portalType="admin" />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute portalType="user">
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute portalType="user">
              <ForgotPasswordPage portalType="user" />
            </PublicRoute>
          } />
          <Route path="/admin/forgot-password" element={
            <PublicRoute portalType="admin">
              <ForgotPasswordPage portalType="admin" />
            </PublicRoute>
          } />
          <Route path="/update-password" element={
            <PublicRoute portalType="user">
              <UpdatePasswordPage portalType="user" />
            </PublicRoute>
          } />
          <Route path="/admin/update-password" element={
            <PublicRoute portalType="admin">
              <UpdatePasswordPage portalType="admin" />
            </PublicRoute>
          } />

          {/* Smart Root Route */}
          <Route path="/" element={<RootRedirect />} />

          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/menu" element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/foods" element={
            <ProtectedRoute requiredRole="ADMIN">
              <FoodManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="ADMIN">
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="ADMIN">
              <SettingsPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<FallbackRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;