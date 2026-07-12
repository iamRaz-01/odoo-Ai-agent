import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboardApi';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  full: () => [...dashboardKeys.all, 'full'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  health: () => [...dashboardKeys.all, 'health'] as const,
  utilization: () => [...dashboardKeys.all, 'utilization'] as const,
  documents: () => [...dashboardKeys.all, 'documents'] as const,
  maintenance: () => [...dashboardKeys.all, 'maintenance'] as const,
};

export function useFullDashboard() {
  return useQuery({
    queryKey: dashboardKeys.full(),
    queryFn: dashboardApi.getFullDashboard,
  });
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: dashboardApi.getSummary,
  });
}

export function useDashboardHealth() {
  return useQuery({
    queryKey: dashboardKeys.health(),
    queryFn: dashboardApi.getHealth,
  });
}

export function useDashboardUtilization() {
  return useQuery({
    queryKey: dashboardKeys.utilization(),
    queryFn: dashboardApi.getUtilization,
  });
}

export function useDashboardDocuments() {
  return useQuery({
    queryKey: dashboardKeys.documents(),
    queryFn: dashboardApi.getDocumentAlerts,
  });
}
