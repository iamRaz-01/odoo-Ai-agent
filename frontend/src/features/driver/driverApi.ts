import httpClient from '../../api/httpClient';
import type { ApiResponse } from '../../types/api';
import type { PageResponse } from '../../types/fleet';
import type {
  DriverResponse,
  DriverRequest,
  DriverUpdateRequest,
  DriverSearchRequest,
  DriverAvailabilityResponse,
  DriverStatusResponse
} from '../../types/driver';

export const driverApi = {
  getDrivers: async (params: {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const response = await httpClient.get<ApiResponse<PageResponse<DriverResponse>>>('/drivers', { params });
    return response.data.data;
  },

  searchDrivers: async (params: DriverSearchRequest & {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const response = await httpClient.get<ApiResponse<PageResponse<DriverResponse>>>('/drivers/search', { params });
    return response.data.data;
  },

  getDriverById: async (id: number) => {
    const response = await httpClient.get<ApiResponse<DriverResponse>>(`/drivers/${id}`);
    return response.data.data;
  },

  createDriver: async (data: DriverRequest) => {
    const response = await httpClient.post<ApiResponse<DriverResponse>>('/drivers', data);
    return response.data.data;
  },

  updateDriver: async (id: number, data: DriverUpdateRequest) => {
    const response = await httpClient.put<ApiResponse<DriverResponse>>(`/drivers/${id}`, data);
    return response.data.data;
  },

  deleteDriver: async (id: number) => {
    await httpClient.delete<ApiResponse<void>>(`/drivers/${id}`);
  },

  activateDriver: async (id: number) => {
    const response = await httpClient.patch<ApiResponse<DriverResponse>>(`/drivers/${id}/activate`);
    return response.data.data;
  },

  suspendDriver: async (id: number) => {
    const response = await httpClient.patch<ApiResponse<DriverResponse>>(`/drivers/${id}/suspend`);
    return response.data.data;
  },

  offDutyDriver: async (id: number) => {
    const response = await httpClient.patch<ApiResponse<DriverResponse>>(`/drivers/${id}/off-duty`);
    return response.data.data;
  },

  checkAvailability: async (id: number) => {
    const response = await httpClient.get<ApiResponse<DriverAvailabilityResponse>>(`/drivers/${id}/availability`);
    return response.data.data;
  },

  getAvailableDrivers: async () => {
    const response = await httpClient.get<ApiResponse<DriverResponse[]>>('/drivers/available');
    return response.data.data;
  }
};
