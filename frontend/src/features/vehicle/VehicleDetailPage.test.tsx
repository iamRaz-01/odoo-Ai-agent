import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VehicleDetailPage } from './VehicleDetailPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// Mock React Query
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

// Mock the hooks to return success states
vi.mock('./vehicleHooks', () => ({
  useVehicle: () => ({
    data: {
      id: 1,
      registrationNumber: 'NY-1111',
      capacity: 5,
      acquisitionCost: 20000,
      odometer: 1500,
      status: 'ACTIVE',
      name: 'Truck Alpha',
      model: 'Ford F-150'
    },
    isLoading: false,
    isError: false
  }),
  useVehicleDocuments: () => ({ data: [], isLoading: false }),
  useVehicleReadiness: () => ({
    data: {
      ready: true,
      insuranceValid: true,
      fitnessValid: true,
      pollutionValid: true,
      fuelAvailable: true,
      driverAssigned: true,
      maintenanceCompleted: true,
      noActiveBreakdown: true,
      issues: []
    },
    isLoading: false
  }),
  useVehicleTelemetry: () => ({
    data: {
      engineTemperature: 92.5,
      batteryVoltage: 13.8,
      fuelLevel: 80.0,
      tirePressure: 32.0,
      brakeStatus: 'GOOD',
      oilHealth: 'EXCELLENT',
      engineFaultCodes: [],
      mileage: 1500
    },
    isLoading: false
  }),
  useUploadDocument: () => ({ mutateAsync: vi.fn() }),
  useUpdateDocument: () => ({ mutateAsync: vi.fn() }),
  useDeleteDocument: () => ({ mutateAsync: vi.fn() }),
  useScheduleMaintenance: () => ({ mutateAsync: vi.fn() }),
  useCloseMaintenance: () => ({ mutateAsync: vi.fn() })
}));

describe('VehicleDetailPage', () => {
  it('renders specs, dispatch readiness check, and diagnostic telemetry cards', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/fleet/vehicles/1']}>
          <VehicleDetailPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verify Title & Specifications
    expect(screen.getByText('Vehicle: NY-1111')).toBeInTheDocument();
    expect(screen.getByText('Truck Alpha (Ford F-150)')).toBeInTheDocument();

    // Verify Dispatch Readiness Check
    expect(screen.getByText('Status: READY FOR DISPATCH')).toBeInTheDocument();
    expect(screen.getByText('Insurance Validation')).toBeInTheDocument();
    expect(screen.getByText('Driver Assigned')).toBeInTheDocument();

    // Verify Diagnostic Telemetry
    expect(screen.getByText('Vehicle Diagnostics (Telemetry)')).toBeInTheDocument();
    expect(screen.getByText('No DTC fault codes detected.')).toBeInTheDocument();
  });
});
