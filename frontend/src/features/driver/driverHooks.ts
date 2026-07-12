import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverApi } from './driverApi';
import type { DriverRequest, DriverUpdateRequest, DriverSearchRequest } from '../../types/driver';

export const driverKeys = {
  all: ['drivers'] as const,
  lists: () => [...driverKeys.all, 'list'] as const,
  list: (params: any) => [...driverKeys.lists(), params] as const,
  details: () => [...driverKeys.all, 'detail'] as const,
  detail: (id: number) => [...driverKeys.details(), id] as const,
  availability: (id: number) => [...driverKeys.all, 'availability', id] as const,
};

export function useDrivers(params: {
  page?: number;
  size?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: driverKeys.list(params),
    queryFn: () => driverApi.getDrivers(params),
  });
}

export function useDriverSearch(params: DriverSearchRequest & {
  page?: number;
  size?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: driverKeys.list(params),
    queryFn: () => driverApi.searchDrivers(params),
  });
}

export function useDriver(id: number) {
  return useQuery({
    queryKey: driverKeys.detail(id),
    queryFn: () => driverApi.getDriverById(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useDriverAvailability(id: number) {
  return useQuery({
    queryKey: driverKeys.availability(id),
    queryFn: () => driverApi.checkAvailability(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DriverRequest) => driverApi.createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
    },
  });
}

export function useUpdateDriver(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DriverUpdateRequest) => driverApi.updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
      queryClient.invalidateQueries({ queryKey: driverKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: driverKeys.availability(id) });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => driverApi.deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
    },
  });
}

export function useActivateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => driverApi.activateDriver(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
      queryClient.invalidateQueries({ queryKey: driverKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: driverKeys.availability(id) });
    },
  });
}

export function useSuspendDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => driverApi.suspendDriver(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
      queryClient.invalidateQueries({ queryKey: driverKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: driverKeys.availability(id) });
    },
  });
}

export function useOffDutyDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => driverApi.offDutyDriver(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
      queryClient.invalidateQueries({ queryKey: driverKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: driverKeys.availability(id) });
    },
  });
}

export function useAvailableDrivers() {
  return useQuery({
    queryKey: [...driverKeys.all, 'available'] as const,
    queryFn: () => driverApi.getAvailableDrivers(),
  });
}
