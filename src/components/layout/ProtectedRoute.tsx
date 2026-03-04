import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
interface ProtectedRouteProps {
  requireAdmin?: boolean;
}
export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== 'ADMIN')
  return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}