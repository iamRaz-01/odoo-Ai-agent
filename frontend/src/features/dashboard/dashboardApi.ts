import httpClient from '../../api/httpClient';
import type {
  FleetDashboardResponse,
  FleetSummaryResponse,
  FleetHealthResponse,
  AlertResponse,
  FleetAnalyticsResponse
} from '../../types/fleet';

export const dashboardApi = {
  getFullDashboard: async () => {
    const response = await httpClient.get<{ data: FleetDashboardResponse }>('/fleet/dashboard');
    return response.data.data;
  },

  getSummary: async () => {
    const response = await httpClient.get<{ data: FleetSummaryResponse }>('/fleet/dashboard/summary');
    return response.data.data;
  },

  getHealth: async () => {
    const response = await httpClient.get<{ data: FleetHealthResponse }>('/fleet/dashboard/health');
    return response.data.data;
  },

  getUtilization: async () => {
    const response = await httpClient.get<{ data: number }>('/fleet/dashboard/utilization');
    return response.data.data;
  },

  getDocumentAlerts: async () => {
    const response = await httpClient.get<{ data: AlertResponse[] }>('/fleet/dashboard/documents');
    return response.data.data;
  },

  getMaintenanceAlerts: async () => {
    const response = await httpClient.get<{ data: AlertResponse[] }>('/fleet/dashboard/maintenance');
    return response.data.data;
  },

  getAnalytics: async () => {
    const response = await httpClient.get<{ data: FleetAnalyticsResponse }>('/fleet/dashboard/analytics');
    return response.data.data;
  },

  getActiveAlerts: async () => {
    const response = await httpClient.get<{ data: AlertResponse[] }>('/fleet/dashboard/alerts');
    return response.data.data;
  }
};
