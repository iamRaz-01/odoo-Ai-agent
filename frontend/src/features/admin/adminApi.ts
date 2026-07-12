import axios from 'axios';
import httpClient from '../../api/httpClient';
import type { ApiResponse } from '../../types/api';
import type { AdminDashboardResponse } from '../../types/admin';

const getActuatorBaseUrl = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';
  // Remove trailing slashes and api/v1 to locate the actuator path correctly
  return apiBase.replace(/\/api\/v1\/?$/, '') + '/actuator/health';
};

export const adminApi = {
  getDashboardStats: async () => {
    const response = await httpClient.get<ApiResponse<AdminDashboardResponse>>('/admin/dashboard');
    return response.data.data;
  },

  getSystemHealth: async () => {
    const url = getActuatorBaseUrl();
    const response = await axios.get<{ status: string }>(url);
    return response.data;
  }
};
