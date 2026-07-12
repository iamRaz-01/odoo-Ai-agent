import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StarIcon from '@mui/icons-material/Star';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { useDriver, useActivateDriver, useSuspendDriver, useOffDutyDriver } from './driverHooks';
import { DriverStatusChip } from './DriverStatusChip';
import { DriverAvailabilityBadge } from './DriverAvailabilityBadge';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../authentication/authApi';
import { useMutation } from '@tanstack/react-query';

export const DriverDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const driverId = Number(id);

  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clearSession);
  const userRole = user?.role?.name;
  const isDriverRole = userRole === 'DRIVER';
  const canModifyStatus = userRole === 'ADMIN' || userRole === 'SAFETY_OFFICER';

  // Profile Logout for Driver role
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clear();
      navigate('/login', { replace: true });
    }
  });

  // Query details
  const { data: driver, isLoading, isError, error } = useDriver(driverId);

  // Status mutations
  const activateMutation = useActivateDriver();
  const suspendMutation = useSuspendDriver();
  const offDutyMutation = useOffDutyDriver();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !driver) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert
          severity="error"
          action={
            !isDriverRole && (
              <Button color="inherit" onClick={() => navigate('/safety/drivers')}>
                Back to Registry
              </Button>
            )
          }
        >
          {error?.message || 'Driver profile not found.'}
        </Alert>
      </Box>
    );
  }

  const handleActivate = () => activateMutation.mutate(driver.id);
  const handleSuspend = () => suspendMutation.mutate(driver.id);
  const handleOffDuty = () => offDutyMutation.mutate(driver.id);

  const detailContent = (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Personnel Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BadgeIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Driver License ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {driver.licenseNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BadgeIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        License Category
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {driver.licenseCategory}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DateRangeIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        License Expiration
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {driver.licenseExpiry}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Primary Contact
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {driver.phoneNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Email Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {driver.email || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ContactPhoneIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Emergency Contact
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {driver.emergencyContact || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Safety Score Card */}
            <Card elevation={1}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Safety Performance Score
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, my: 1.5 }}>
                  <StarIcon sx={{ color: '#faaf00', fontSize: 36 }} />
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {driver.safetyScore}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ alignSelf: 'flex-end', mb: 0.5 }}>
                    /100
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Calculated based on traffic compliance, safe miles, and inspection violations.
                </Typography>
              </CardContent>
            </Card>

            {/* Quick Actions / Status Changes Card */}
            {canModifyStatus && (
              <Card elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Status Transitions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      onClick={handleActivate}
                      disabled={driver.status === 'AVAILABLE' || activateMutation.isPending}
                    >
                      Set Available
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      onClick={handleOffDuty}
                      disabled={driver.status === 'OFF_DUTY' || offDutyMutation.isPending}
                    >
                      Set Off Duty
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={handleSuspend}
                      disabled={driver.status === 'SUSPENDED' || suspendMutation.isPending}
                    >
                      Suspend Driver
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  // If driver user is viewing their own profile, render top navigation bar layout
  if (isDriverRole) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              TransitOps Driver Profile
            </Typography>
            <Button
              color="inherit"
              startIcon={<PowerSettingsNewIcon />}
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, pt: 4 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Welcome, {driver.fullName}
              </Typography>
              <Typography color="text.secondary">
                View your active driver profile credentials. Emergency contact info can be updated by manager.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <DriverStatusChip status={driver.status} />
              <DriverAvailabilityBadge driverId={driver.id} />
            </Stack>
          </Box>
          {detailContent}
        </Box>
      </Box>
    );
  }

  // Normal staff view inside layout
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/safety/drivers" underline="hover" color="inherit">
          Drivers
        </Link>
        <Typography color="text.primary">{driver.fullName}</Typography>
      </Breadcrumbs>

      {/* Header Block */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/safety/drivers')} variant="outlined">
          Back
        </Button>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Driver Details: {driver.fullName}
          </Typography>
        </Box>
        <DriverStatusChip status={driver.status} />
        <DriverAvailabilityBadge driverId={driver.id} />
      </Stack>

      {detailContent}
    </Box>
  );
};
export default DriverDetailPage;
