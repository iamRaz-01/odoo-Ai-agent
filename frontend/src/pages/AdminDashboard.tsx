import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SyncIcon from '@mui/icons-material/Sync';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAdminDashboard, useSystemHealth } from '../features/admin/adminHooks';

export function AdminDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Queries
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useAdminDashboard();

  const {
    data: health,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth
  } = useSystemHealth();

  // Handle manual full refresh
  const handleRefresh = () => {
    refetchStats();
    refetchHealth();
  };

  // Determine Actuator status color and label
  const getHealthStatus = () => {
    if (healthLoading) return { label: 'CHECKING...', color: 'default', icon: <CircularProgress size={16} color="inherit" /> };
    if (healthError) return { label: 'DOWN', color: 'error', icon: <HighlightOffIcon /> };
    
    const status = health?.status?.toUpperCase() || 'UNKNOWN';
    switch (status) {
      case 'UP':
        return { label: 'UP', color: 'success', icon: <CheckCircleIcon /> };
      case 'DEGRADED':
      case 'OUT_OF_SERVICE':
        return { label: 'DEGRADED', color: 'warning', icon: <WarningIcon /> };
      case 'DOWN':
        return { label: 'DOWN', color: 'error', icon: <HighlightOffIcon /> };
      default:
        return { label: 'UNKNOWN', color: 'default', icon: <InfoIcon /> };
    }
  };

  const healthStatus = getHealthStatus();

  if (statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={50} />
        <Typography color="text.secondary">Loading System Administration Console...</Typography>
      </Box>
    );
  }

  if (statsError || !stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={handleRefresh} startIcon={<SyncIcon />}>
            Retry
          </Button>
        }>
          Failed to load system statistics. Please verify backend connectivity.
        </Alert>
      </Box>
    );
  }

  // Format roles helper
  const formatRoleName = (role: string) => {
    return role.replace('ROLE_', '').replace('_', ' ');
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            System Administration Dashboard
          </Typography>
          <Typography color="text.secondary">
            Monitor real-time system metrics, role distributions, audit trails, and core service health status.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<SyncIcon />} onClick={handleRefresh} disabled={healthLoading || statsLoading}>
          Refresh
        </Button>
      </Box>

      {/* Overview Aggregates Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Active Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <PeopleIcon />
                </Avatar>
              </Stack>
              <Chip label="Manage Accounts" size="small" onClick={() => navigate('/users')} sx={{ mt: 1.5, cursor: 'pointer' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Fleet Vehicles
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {stats.totalVehicles}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                  <DirectionsCarIcon />
                </Avatar>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Available Vehicles: <strong>{stats.availableVehicles}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Active Drivers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {stats.totalDrivers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                  <SupervisorAccountIcon />
                </Avatar>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Active Trips: <strong>{stats.activeTrips}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Maintenance Load
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {stats.maintenanceCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                  <BuildIcon />
                </Avatar>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Total Operational Trips: <strong>{stats.totalTrips}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* System Logs */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  System Audit Logs
                </Typography>
                <HistoryIcon color="action" />
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {stats.recentActivity.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No recent system activity recorded.</Typography>
                </Box>
              ) : (
                <List>
                  {stats.recentActivity.map((log) => (
                    <ListItem key={log.id} disableGutters divider>
                      <ListItemIcon>
                        {log.type === 'error' ? (
                          <ErrorIcon color="error" />
                        ) : log.type === 'warning' ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <InfoIcon color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={log.action}
                        secondary={`Actor: ${log.actor}`}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {log.time}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Health & Role Config */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Actuator Service Health status */}
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Service Health Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Core API Engine
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Actuator Endpoint: /health
                    </Typography>
                  </Box>
                  <Chip
                    icon={healthStatus.icon}
                    label={healthStatus.label}
                    color={healthStatus.color as any}
                    sx={{ fontWeight: 'bold', px: 1 }}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, textAlign: 'right' }}>
                  Auto-refresh: every 30s
                </Typography>
              </CardContent>
            </Card>

            {/* Role Accounts Summary */}
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Accounts by Role
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List dense>
                  {Object.entries(stats.roleCounts).map(([role, count]) => (
                    <ListItem key={role} disableGutters sx={{ py: 0.5 }}>
                      <ListItemText primary={formatRoleName(role)} />
                      <Chip label={count} size="small" variant="outlined" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
