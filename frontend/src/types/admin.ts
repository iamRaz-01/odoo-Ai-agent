export interface RecentActivityResponse {
  id: number;
  action: string;
  actor: string;
  time: string;
  type: 'info' | 'warning' | 'error';
}

export interface AdminDashboardResponse {
  totalUsers: number;
  totalVehicles: number;
  availableVehicles: number;
  totalDrivers: number;
  totalTrips: number;
  activeTrips: number;
  fuelLogsCount: number;
  expensesCount: number;
  maintenanceCount: number;
  roleCounts: Record<string, number>;
  recentActivity: RecentActivityResponse[];
}
