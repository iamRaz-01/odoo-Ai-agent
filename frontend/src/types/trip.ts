export type TripStatus = 'DRAFT' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TripPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TripResponse {
  id: number;
  tripNumber: string;
  tripName: string;
  description?: string;
  priority: TripPriority;
  source: string;
  destination: string;
  cargoType: string;
  cargoWeight: number;
  plannedDate: string; // YYYY-MM-DD
  plannedTime: string; // HH:mm:ss or HH:mm
  vehicleId?: number;
  vehicleRegistrationNumber?: string;
  driverId?: number;
  driverName?: string;
  status: TripStatus;
  createdByUserId: number;
  createdByUserName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripRequest {
  tripName: string;
  description?: string;
  priority: TripPriority;
  source: string;
  destination: string;
  cargoType: string;
  cargoWeight: number;
  plannedDate: string;
  plannedTime: string;
  vehicleId?: number | null;
  driverId?: number | null;
}

export interface TripAssignRequest {
  driverId?: number | null;
  vehicleId?: number | null;
}

export interface TripSearchRequest {
  status?: string;
  priority?: string;
  plannedDate?: string;
  searchTerm?: string;
}
