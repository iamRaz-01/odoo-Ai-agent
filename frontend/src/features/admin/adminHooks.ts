import { useQuery } from '@tanstack/react-query';
import { adminApi } from './adminApi';

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  health: () => [...adminKeys.all, 'health'] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.getDashboardStats(),
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: adminKeys.health(),
    queryFn: () => adminApi.getSystemHealth(),
    refetchInterval: 30000, // Refresh automatically every 30 seconds
    retry: 2,
    retryDelay: 3000,
  });
}
