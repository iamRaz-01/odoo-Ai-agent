export type DriverStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'ON_TRIP'
  | 'OFF_DUTY'
  | 'SUSPENDED'
  | 'INACTIVE';

export interface DriverResponse {
  id: number;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string; // ISO date string YYYY-MM-DD
  phoneNumber: string;
  email?: string;
  emergencyContact?: string;
  safetyScore: number;
  status: DriverStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverRequest {
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string; // YYYY-MM-DD
  phoneNumber: string;
  email?: string;
  emergencyContact?: string;
  safetyScore?: number;
  status?: DriverStatus;
}

export interface DriverUpdateRequest {
  fullName: string;
  licenseCategory: string;
  licenseExpiry: string; // YYYY-MM-DD
  phoneNumber: string;
  email?: string;
  emergencyContact?: string;
  safetyScore?: number;
  status?: DriverStatus;
}

export interface DriverSearchRequest {
  name?: string;
  licenseNumber?: string;
  status?: DriverStatus;
  licenseCategory?: string;
  minSafetyScore?: number;
  licenseExpiryBefore?: string;
  licenseExpiryAfter?: string;
}

export interface DriverAvailabilityResponse {
  driverId: number;
  available: boolean;
  reason: string | null;
}

export interface DriverStatusResponse {
  driverId: number;
  status: DriverStatus;
}
