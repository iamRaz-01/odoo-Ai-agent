import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleApi } from './vehicleApi';
import type { VehicleRequest, VehicleUpdateRequest, VehicleDocumentRequest } from '../../types/fleet';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (params: any) => [...vehicleKeys.lists(), params] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: number) => [...vehicleKeys.details(), id] as const,
  types: () => [...vehicleKeys.all, 'types'] as const,
  documents: (vehicleId: number) => [...vehicleKeys.all, 'documents', vehicleId] as const,
};

export function useVehicles(params: {
  search?: string;
  status?: string;
  typeId?: number;
  page?: number;
  size?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: () => vehicleApi.getVehicles(params),
  });
}

export function useVehicle(id: number) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleApi.getVehicleById(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useVehicleTypes() {
  return useQuery({
    queryKey: vehicleKeys.types(),
    queryFn: () => vehicleApi.getVehicleTypes(),
  });
}

export function useVehicleDocuments(vehicleId: number) {
  return useQuery({
    queryKey: vehicleKeys.documents(vehicleId),
    queryFn: () => vehicleApi.getVehicleDocuments(vehicleId),
    enabled: !!vehicleId && !isNaN(vehicleId),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VehicleRequest) => vehicleApi.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}

export function useUpdateVehicle(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VehicleUpdateRequest) => vehicleApi.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}

export function useUploadDocument(vehicleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VehicleDocumentRequest) => vehicleApi.uploadVehicleDocument(vehicleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.documents(vehicleId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateDocument(vehicleId: number, documentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VehicleDocumentRequest) => vehicleApi.updateVehicleDocument(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.documents(vehicleId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteDocument(vehicleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: number) => vehicleApi.deleteVehicleDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.documents(vehicleId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
