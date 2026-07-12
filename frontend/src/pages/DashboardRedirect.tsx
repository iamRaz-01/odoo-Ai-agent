import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const DashboardRedirect: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role?.name;

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  switch (role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'FLEET_MANAGER':
      return <Navigate to="/fleet/dashboard" replace />;
    case 'DISPATCHER':
      return <Navigate to="/dispatcher/dashboard" replace />;
    case 'DRIVER':
      return <Navigate to="/driver/dashboard" replace />;
    case 'SAFETY_OFFICER':
      return <Navigate to="/safety/dashboard" replace />;
    case 'FINANCE_OFFICER':
      return <Navigate to="/finance/dashboard" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default DashboardRedirect;
