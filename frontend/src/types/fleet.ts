export type VehicleStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'ON_TRIP'
  | 'IN_SHOP'
  | 'BREAKDOWN'
  | 'RETIRED'
  | 'PURCHASED'
  | 'REGISTERED'
  | 'ACTIVE'
  | 'ASSIGNED'
  | 'MAINTENANCE'
  | 'RETURNED'
  | 'DECOMMISSIONED';

export interface VehicleTypeResponse {
  id: number;
  name: string;
  description: string;
}

export interface VehicleResponse {
  id: number;
  registrationNumber: string;
  vehicleType: VehicleTypeResponse;
  capacity: number;
  acquisitionCost: number;
  odometer: number;
  status: VehicleStatus;
  name?: string;
  model?: string;
  fuelType?: string;
  manufacturingYear?: number | null;
  engineNumber?: string;
  chassisNumber?: string;
  assignedDepot?: string;
  maximumCapacity?: number | null;
  driverId?: number | null;
  fuelLevel?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleRequest {
  registrationNumber: string;
  vehicleTypeId: number;
  capacity: number;
  acquisitionCost: number;
  odometer: number;
  status: VehicleStatus;
  name?: string;
  model?: string;
  fuelType?: string;
  manufacturingYear?: number | null;
  engineNumber?: string;
  chassisNumber?: string;
  assignedDepot?: string;
  maximumCapacity?: number | null;
  driverId?: number | null;
  fuelLevel?: number | null;
}

export interface VehicleUpdateRequest {
  vehicleTypeId: number;
  capacity: number;
  acquisitionCost: number;
  odometer: number;
  status: VehicleStatus;
  name?: string;
  model?: string;
  fuelType?: string;
  manufacturingYear?: number | null;
  engineNumber?: string;
  chassisNumber?: string;
  assignedDepot?: string;
  maximumCapacity?: number | null;
  driverId?: number | null;
  fuelLevel?: number | null;
}

export interface VehicleDocumentResponse {
  id: number;
  vehicleId: number;
  name: string;
  documentNumber: string;
  expiryDate: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleDocumentRequest {
  name: string;
  documentNumber: string;
  expiryDate: string;
  filePath: string;
}

export interface AlertResponse {
  id: number;
  type: string;
  message: string;
  vehicleId: number | null;
  registrationNumber: string;
  details: string;
}

export interface FleetSummaryResponse {
  totalFleet: number;
  activeVehicles: number;
  availableVehicles: number;
  reservedVehicles: number;
  onTrip: number;
  maintenance: number;
  breakdown: number;
  retired: number;
}

export interface FleetHealthResponse {
  score: number;
  breakdownCount: number;
  overdueMaintenanceCount: number;
  expiredDocumentsCount: number;
}

export interface FleetDashboardResponse {
  summary: FleetSummaryResponse;
  health: FleetHealthResponse;
  utilization: number;
  documentAlerts: AlertResponse[];
  maintenanceAlerts: AlertResponse[];
}

export interface VehicleReadinessResponse {
  ready: boolean;
  insuranceValid: boolean;
  fitnessValid: boolean;
  pollutionValid: boolean;
  fuelAvailable: boolean;
  driverAssigned: boolean;
  maintenanceCompleted: boolean;
  noActiveBreakdown: boolean;
  issues: string[];
}

export interface VehicleTelemetryResponse {
  engineTemperature: number | null;
  batteryVoltage: number | null;
  fuelLevel: number | null;
  tirePressure: number | null;
  brakeStatus: string | null;
  oilHealth: string | null;
  engineFaultCodes: string[];
  mileage: number;
}

export interface FleetAnalyticsResponse {
  utilizationRate: number;
  averageFuelEfficiency: number;
  downtimeRate: number;
  totalMaintenanceCost: number;
  totalDistanceCovered: number;
  averageIdleTimeHours: number;
  lifecycleDistribution: Record<string, number>;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
