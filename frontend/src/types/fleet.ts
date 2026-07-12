export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'ON_TRIP' | 'IN_SHOP' | 'BREAKDOWN' | 'RETIRED';

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
}

export interface VehicleUpdateRequest {
  vehicleTypeId: number;
  capacity: number;
  acquisitionCost: number;
  odometer: number;
  status: VehicleStatus;
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
  vehicleId: number;
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

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
