import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripApi } from './tripApi';
import type { TripRequest, TripAssignRequest, TripSearchRequest } from '../../types/trip';

export const tripKeys = {
  all: ['trips'] as const,
  lists: () => [...tripKeys.all, 'list'] as const,
  list: (params: any) => [...tripKeys.lists(), params] as const,
  details: () => [...tripKeys.all, 'detail'] as const,
  detail: (id: number) => [...tripKeys.details(), id] as const,
};

export function useTrips(params: TripSearchRequest & {
  page?: number;
  size?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: tripKeys.list(params),
    queryFn: () => tripApi.getTrips(params),
  });
}

export function useTrip(id: number) {
  return useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => tripApi.getTripById(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TripRequest) => tripApi.createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
    },
  });
}

export function useUpdateTrip(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TripRequest) => tripApi.updateTrip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tripApi.deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
    },
  });
}

export function useAssignTrip(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TripAssignRequest) => tripApi.assignTrip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) });
    },
  });
}

export function useStartTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tripApi.startTrip(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) });
    },
  });
}

export function useCompleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tripApi.completeTrip(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) });
    },
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tripApi.cancelTrip(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) });
    },
  });
}
