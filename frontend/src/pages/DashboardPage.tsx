import React from 'react';
import { Typography, Grid, Box, CircularProgress, Alert, Container } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useFullDashboard } from '../features/dashboard/dashboardHooks';
import { FleetOverviewGrid } from '../features/dashboard/FleetOverviewGrid';
import { FleetHealthCard } from '../features/dashboard/FleetHealthCard';
import { FleetUtilizationCard } from '../features/dashboard/FleetUtilizationCard';
import { FleetStatusChart } from '../features/dashboard/FleetStatusChart';
import { FleetAlertsCard } from '../features/dashboard/FleetAlertsCard';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: dashboard, isLoading, isError, error } = useFullDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !dashboard) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load fleet dashboard analytics. {error?.message || 'Please try again later.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Welcome back, {user?.firstName}
        </Typography>
        <Typography color="text.secondary">
          Monitor real-time fleet health, active utilization metrics, and critical alerts.
        </Typography>
      </Box>

      {/* Summary KPI Grid */}
      <Box sx={{ mb: 4 }}>
        <FleetOverviewGrid summary={dashboard.summary} />
      </Box>

      {/* Main Charts & Health Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FleetHealthCard
            score={dashboard.health.score}
            breakdownCount={dashboard.health.breakdownCount}
            overdueCount={dashboard.health.overdueMaintenanceCount}
            expiredDocsCount={dashboard.health.expiredDocumentsCount}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FleetUtilizationCard utilization={dashboard.utilization} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FleetStatusChart summary={dashboard.summary} />
        </Grid>
        
        {/* Alerts & Critical Alerts Warning List */}
        <Grid size={{ xs: 12 }}>
          <FleetAlertsCard
            documentAlerts={dashboard.documentAlerts}
            maintenanceAlerts={dashboard.maintenanceAlerts}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
export default DashboardPage;
