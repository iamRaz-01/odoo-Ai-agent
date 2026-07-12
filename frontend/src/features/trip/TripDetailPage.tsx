import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import ScaleIcon from '@mui/icons-material/Scale';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

import { useParams, useNavigate } from 'react-router-dom';
import { useTrip, useStartTrip, useCompleteTrip, useCancelTrip } from './tripHooks';
import { TripStatusChip } from './TripStatusChip';
import { TripTimeline } from './TripTimeline';
import { useAuthStore } from '../../store/authStore';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = Number(id);

  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  const isFleetOrAdmin = userRole === 'ADMIN' || userRole === 'FLEET_MANAGER';
  const isDriverOrAdmin = userRole === 'ADMIN' || userRole === 'DRIVER';

  // API calls
  const { data: trip, isLoading, error } = useTrip(tripId);

  const startMutation = useStartTrip();
  const completeMutation = useCompleteTrip();
  const cancelMutation = useCancelTrip();

  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !trip) {
    return (
      <Box sx={{ py: 3 }}>
        <Alert severity="error">Trip details could not be loaded. It may not exist or you lack permission.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/trips')} sx={{ mt: 2 }}>
          Back to Registry
        </Button>
      </Box>
    );
  }

  const handleStart = async () => {
    setActionError(null);
    try {
      await startMutation.mutateAsync(tripId);
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to start trip.');
    }
  };

  const handleComplete = async () => {
    setActionError(null);
    try {
      await completeMutation.mutateAsync(tripId);
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to complete trip.');
    }
  };

  const handleCancel = async () => {
    setActionError(null);
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        await cancelMutation.mutateAsync(tripId);
      } catch (err: any) {
        setActionError(err?.response?.data?.message || 'Failed to cancel trip.');
      }
    }
  };

  const isDraft = trip.status === 'DRAFT';
  const isAssigned = trip.status === 'ASSIGNED';
  const isInProgress = trip.status === 'IN_PROGRESS';
  const isCompleted = trip.status === 'COMPLETED';
  const isCancelled = trip.status === 'CANCELLED';

  return (
    <Box sx={{ py: 3 }}>
      {/* Navigation Header */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="#" onClick={(e) => { e.preventDefault(); navigate('/trips'); }} underline="hover">
          Trips
        </Link>
        <Typography color="text.primary">{trip.tripNumber}</Typography>
      </Breadcrumbs>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/trips')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {trip.tripNumber}
            </Typography>
            <TripStatusChip status={trip.status} size="medium" />
          </Stack>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            {trip.tripName}
          </Typography>
        </Box>

        {/* State actions */}
        <Stack direction="row" spacing={1.5}>
          {isDriverOrAdmin && isAssigned && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<PlayArrowIcon />}
              onClick={handleStart}
              disabled={startMutation.isPending}
            >
              Start Trip
            </Button>
          )}

          {isDriverOrAdmin && isInProgress && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleComplete}
              disabled={completeMutation.isPending}
            >
              Complete Trip
            </Button>
          )}

          {isFleetOrAdmin && !isCompleted && !isCancelled && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              Cancel Trip
            </Button>
          )}
        </Stack>
      </Stack>

      {actionError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left column: Cards details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Route Details Card */}
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FmdGoodIcon color="primary" /> Route details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Origin / Source</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 0.5 }}>
                      {trip.source}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Destination / Unloading hub</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 0.5 }}>
                      {trip.destination}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1.5 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Planned Dispatch Date</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {trip.plannedDate}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Planned Dispatch Time</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {trip.plannedTime.substring(0, 5)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Cargo details Card */}
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory2Icon color="primary" /> Cargo Specifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Cargo Classification</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 0.5 }}>
                      {trip.cargoType}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Declared Cargo Weight</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScaleIcon fontSize="small" color="action" /> {trip.cargoWeight} metric tons
                    </Typography>
                  </Grid>
                  {trip.description && (
                    <>
                      <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1.5 }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">Special Handling Instructions / Notes</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                          {trip.description}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Resources allocated Card */}
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Resource Allocations
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText' }}>
                          <PersonIcon />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Assigned Operator</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {trip.driverName || 'No Driver Assigned'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText' }}>
                          <LocalShippingIcon />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Assigned Transport Unit</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {trip.vehicleRegistrationNumber || 'No Vehicle Assigned'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right column: Trip Timeline Tracker */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Transit Timeline
              </Typography>
              <TripTimeline
                status={trip.status}
                driverName={trip.driverName}
                vehicleRegistrationNumber={trip.vehicleRegistrationNumber}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default TripDetailPage;
