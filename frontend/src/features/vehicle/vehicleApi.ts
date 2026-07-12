import httpClient from '../../api/httpClient';
import type { ApiResponse } from '../../types/api';
import type {
  VehicleResponse,
  VehicleRequest,
  VehicleUpdateRequest,
  VehicleTypeResponse,
  VehicleDocumentResponse,
  VehicleDocumentRequest,
  PageResponse
} from '../../types/fleet';

export const vehicleApi = {
  getVehicles: async (params: {
    search?: string;
    status?: string;
    typeId?: number;
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const response = await httpClient.get<ApiResponse<PageResponse<VehicleResponse>>>('/vehicles', { params });
    return response.data.data;
  },

  getVehicleById: async (id: number) => {
    const response = await httpClient.get<ApiResponse<VehicleResponse>>(`/vehicles/${id}`);
    return response.data.data;
  },

  createVehicle: async (data: VehicleRequest) => {
    const response = await httpClient.post<ApiResponse<VehicleResponse>>('/vehicles', data);
    return response.data.data;
  },

  updateVehicle: async (id: number, data: VehicleUpdateRequest) => {
    const response = await httpClient.put<ApiResponse<VehicleResponse>>(`/vehicles/${id}`, data);
    return response.data.data;
  },

  deleteVehicle: async (id: number) => {
    await httpClient.delete<ApiResponse<Void>>(`/vehicles/${id}`);
  },

  getVehicleTypes: async () => {
    const response = await httpClient.get<ApiResponse<VehicleTypeResponse[]>>('/vehicle-types');
    return response.data.data;
  },

  getVehicleDocuments: async (vehicleId: number) => {
    const response = await httpClient.get<ApiResponse<VehicleDocumentResponse[]>>(`/vehicles/${vehicleId}/documents`);
    return response.data.data;
  },

  uploadVehicleDocument: async (vehicleId: number, data: VehicleDocumentRequest) => {
    const response = await httpClient.post<ApiResponse<VehicleDocumentResponse>>(`/vehicles/${vehicleId}/documents`, data);
    return response.data.data;
  },

  updateVehicleDocument: async (documentId: number, data: VehicleDocumentRequest) => {
    const response = await httpClient.put<ApiResponse<VehicleDocumentResponse>>(`/documents/${documentId}`, data);
    return response.data.data;
  },

  deleteVehicleDocument: async (documentId: number) => {
    await httpClient.delete<ApiResponse<Void>>(`/documents/${documentId}`);
  }
};
type Void = void;
