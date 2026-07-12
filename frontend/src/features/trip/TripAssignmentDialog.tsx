import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Alert
} from '@mui/material';
import { useDriverSearch } from '../driver/driverHooks';
import { useVehicles } from '../vehicle/vehicleHooks';
import { useAssignTrip } from './tripHooks';
import type { TripResponse } from '../../types/trip';

interface TripAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  trip: TripResponse | null;
}

export const TripAssignmentDialog: React.FC<TripAssignmentDialogProps> = ({
  open,
  onClose,
  trip
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<number | ''>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | ''>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load available drivers
  const { data: driverPage, isLoading: loadingDrivers } = useDriverSearch({
    status: 'AVAILABLE',
    size: 100
  });

  // Load available vehicles
  const { data: vehiclePage, isLoading: loadingVehicles } = useVehicles({
    status: 'AVAILABLE',
    size: 100
  });

  const assignMutation = useAssignTrip(trip?.id || 0);

  useEffect(() => {
    if (open && trip) {
      setSelectedDriverId(trip.driverId || '');
      setSelectedVehicleId(trip.vehicleId || '');
      setErrorMsg(null);
    }
  }, [open, trip]);

  const handleAssign = async () => {
    if (!trip) return;

    setErrorMsg(null);
    try {
      await assignMutation.mutateAsync({
        driverId: selectedDriverId === '' ? null : selectedDriverId,
        vehicleId: selectedVehicleId === '' ? null : selectedVehicleId
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to assign trip resources.');
    }
  };

  const driversList = driverPage?.content || [];
  const vehiclesList = vehiclePage?.content || [];

  const isLoading = loadingDrivers || loadingVehicles;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Assign Driver & Vehicle
      </DialogTitle>
      <DialogContent dividers>
        {trip && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Trip Details
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              {trip.tripNumber}: {trip.tripName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Route: {trip.source} → {trip.destination} | Cargo: {trip.cargoType} ({trip.cargoWeight} tons)
            </Typography>
          </Box>
        )}

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="assign-driver-label">Assign Driver</InputLabel>
                <Select
                  labelId="assign-driver-label"
                  value={selectedDriverId}
                  label="Assign Driver"
                  onChange={(e) => setSelectedDriverId(e.target.value as number | '')}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {driversList.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.fullName} (Score: {driver.safetyScore} | Category: {driver.licenseCategory})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Only available drivers with valid licenses are displayed.
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="assign-vehicle-label">Assign Vehicle</InputLabel>
                <Select
                  labelId="assign-vehicle-label"
                  value={selectedVehicleId}
                  label="Assign Vehicle"
                  onChange={(e) => setSelectedVehicleId(e.target.value as number | '')}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {vehiclesList.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} (Capacity: {vehicle.capacity}t | Status: {vehicle.status})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Select a vehicle with capacity sufficient for the cargo weight ({trip?.cargoWeight}t).
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={assignMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          color="primary"
          disabled={isLoading || assignMutation.isPending}
        >
          {assignMutation.isPending ? 'Assigning...' : 'Save Assignments'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default TripAssignmentDialog;
