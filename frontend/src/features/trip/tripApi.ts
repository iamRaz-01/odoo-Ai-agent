import httpClient from '../../api/httpClient';
import type { ApiResponse } from '../../types/api';
import type { PageResponse } from '../../types/fleet';
import type {
  TripResponse,
  TripRequest,
  TripAssignRequest,
  TripSearchRequest
} from '../../types/trip';

export const tripApi = {
  getTrips: async (params: TripSearchRequest & {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const response = await httpClient.get<ApiResponse<PageResponse<TripResponse>>>('/trips', { params });
    return response.data.data;
  },

  getTripById: async (id: number) => {
    const response = await httpClient.get<ApiResponse<TripResponse>>(`/trips/${id}`);
    return response.data.data;
  },

  createTrip: async (data: TripRequest) => {
    const response = await httpClient.post<ApiResponse<TripResponse>>('/trips', data);
    return response.data.data;
  },

  updateTrip: async (id: number, data: TripRequest) => {
    const response = await httpClient.put<ApiResponse<TripResponse>>(`/trips/${id}`, data);
    return response.data.data;
  },

  deleteTrip: async (id: number) => {
    await httpClient.delete<ApiResponse<void>>(`/trips/${id}`);
  },

  assignTrip: async (id: number, data: TripAssignRequest) => {
    const response = await httpClient.patch<ApiResponse<TripResponse>>(`/trips/${id}/assign`, data);
    return response.data.data;
  },

  startTrip: async (id: number) => {
    const response = await httpClient.patch<ApiResponse<TripResponse>>(`/trips/${id}/start`);
    return response.data.data;
  },

  completeTrip: async (id: number) => {
    const response = await httpClient.patch<ApiResponse<TripResponse>>(`/trips/${id}/complete`);
    return response.data.data;
  },

  cancelTrip: async (id: number) => {
    const response = await httpClient.patch<ApiResponse<TripResponse>>(`/trips/${id}/cancel`);
    return response.data.data;
  }
};
