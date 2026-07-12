import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTrips, useStartTrip, useCompleteTrip } from '../features/trip/tripHooks';
import { TripStatusChip } from '../features/trip/TripStatusChip';

export function DriverDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Fetch driver's trips. The backend automatically filters by the current driver's profile.
  const { data: tripPage, isLoading, error } = useTrips({ size: 10 });
  
  const startMutation = useStartTrip();
  const completeMutation = useCompleteTrip();

  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);

  const trips = tripPage?.content || [];
  
  // Find current active trip or the next assigned trip
  const activeTrip = trips.find(t => t.status === 'IN_PROGRESS') || trips.find(t => t.status === 'ASSIGNED');

  const handleStart = async (id: number) => {
    try {
      await startMutation.mutateAsync(id);
      setNotification({ open: true, message: 'Trip started successfully!', severity: 'success' });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err?.response?.data?.message || 'Failed to start trip.',
        severity: 'error'
      });
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await completeMutation.mutateAsync(id);
      setNotification({ open: true, message: 'Trip completed successfully!', severity: 'success' });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err?.response?.data?.message || 'Failed to complete trip.',
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Driver Workspace Portal
        </Typography>
        <Typography color="text.secondary">
          View your daily trip assignments, log trip updates, and view licensing compliance.
        </Typography>
      </Box>

      {/* Driver CDL Standing Banner */}
      <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 4 }}>
        Your Commercial Driver License (CDL) credentials and safety rating are verified and in active standing.
      </Alert>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load assigned trips.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Active Assigned Trip Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            {activeTrip ? (
              <Card
                elevation={3}
                sx={{
                  borderLeft: '6px solid',
                  borderColor: activeTrip.status === 'IN_PROGRESS' ? 'warning.main' : 'primary.main',
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Current Trip Assignment
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created by {activeTrip.createdByUserName}
                      </Typography>
                    </Box>
                    <TripStatusChip status={activeTrip.status} size="medium" />
                  </Stack>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Trip Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {activeTrip.tripNumber}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Route Locations
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {activeTrip.source} <ArrowForwardIcon fontSize="inherit" /> {activeTrip.destination}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Cargo Payload
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                        {activeTrip.cargoType} ({activeTrip.cargoWeight} tons)
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Assigned Vehicle
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                        {activeTrip.vehicleRegistrationNumber || 'None'}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                      Schedule: {activeTrip.plannedDate} at {activeTrip.plannedTime.substring(0, 5)}
                    </Typography>
                    
                    <Stack direction="row" spacing={1.5}>
                      {activeTrip.status === 'ASSIGNED' && (
                        <Button
                          variant="contained"
                          color="warning"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => handleStart(activeTrip.id)}
                          disabled={startMutation.isPending}
                        >
                          Start Trip
                        </Button>
                      )}
                      {activeTrip.status === 'IN_PROGRESS' && (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleComplete(activeTrip.id)}
                          disabled={completeMutation.isPending}
                        >
                          Complete Trip
                        </Button>
                      )}
                      <Button variant="outlined" size="small" onClick={() => navigate(`/trips/${activeTrip.id}`)}>
                        Details
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ borderRadius: 2, bgcolor: 'background.paper', p: 3, textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1 }}>
                    No Active Trips
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No active trips are assigned to you at the moment. Keep up the safe driving!
                  </Typography>
                  <Button variant="contained" size="small" onClick={() => navigate('/trips')}>
                    View Past Trips
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Driver Stats & Quick Actions */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* Safety Rating */}
              <Card elevation={1} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Your Driving Safety Rating
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, my: 1 }}>
                    <StarIcon sx={{ color: '#faaf00', fontSize: 32 }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      98
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ alignSelf: 'flex-end', mb: 0.5 }}>
                      /100
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Excellent score. Keep up the safe miles!
                  </Typography>
                </CardContent>
              </Card>

              {/* Quick Logging Options */}
              <Card elevation={1} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Daily Trip Logs
                  </Typography>
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<LocalGasStationIcon />}
                      onClick={() => navigate('/driver/fuel-logs')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Submit Fuel Log
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AttachMoneyIcon />}
                      onClick={() => navigate('/driver/expenses')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Submit Expense Claim
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BuildIcon />}
                      onClick={() => navigate('/driver/inspection')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Pre-Trip Inspection
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}

      {/* Notification Toast */}
      {notification && (
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setNotification(null)} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default DriverDashboard;
