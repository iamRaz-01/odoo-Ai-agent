import React from 'react';
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Container,
  Card,
  CardContent,
  Button,
  Stack,
  Divider
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SpeedIcon from '@mui/icons-material/Speed';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { useFullDashboard, useDashboardAnalytics } from '../features/dashboard/dashboardHooks';
import { FleetOverviewGrid } from '../features/dashboard/FleetOverviewGrid';
import { FleetHealthCard } from '../features/dashboard/FleetHealthCard';
import { FleetUtilizationCard } from '../features/dashboard/FleetUtilizationCard';
import { FleetStatusChart } from '../features/dashboard/FleetStatusChart';
import { FleetAlertsCard } from '../features/dashboard/FleetAlertsCard';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const { data: dashboard, isLoading: dashboardLoading, isError: dashboardError, error: dashError } = useFullDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useDashboardAnalytics();

  if (dashboardLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (dashboardError || !dashboard) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load fleet dashboard analytics. {dashError?.message || 'Please try again later.'}
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Charts & Health Cards */}
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
      </Grid>

      <Grid container spacing={3}>
        {/* Fleet Analytics Widget */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Fleet Operations Analytics
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {analyticsLoading ? (
                <CircularProgress />
              ) : analytics ? (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <SpeedIcon color="primary" sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Total Distance Covered
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {analytics.totalDistanceCovered.toLocaleString()} km
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ReportProblemIcon color="warning" sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Downtime Rate
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {analytics.downtimeRate.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocalAtmIcon color="success" sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Est. Maintenance Cost (MTD)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          ${analytics.totalMaintenanceCost.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocalGasStationIcon color="info" sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Avg. Fuel Efficiency
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {analytics.averageFuelEfficiency.toFixed(1)} km/L
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Typography color="text.secondary">Analytics details currently offline.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DirectionsCarIcon />}
                  onClick={() => navigate('/vehicles')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Manage Registry
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BuildIcon />}
                  onClick={() => navigate('/vehicles')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Schedule Maintenance
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => navigate('/vehicles')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Upload Documents
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AnalyticsIcon />}
                  onClick={() => navigate('/vehicles')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Check Dispatch Readiness
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts & Critical Alerts Warning List */}
        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
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
