import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Stack,
  Alert,
  Autocomplete
} from '@mui/material';
import { useDriverSearch } from '../driver/driverHooks';
import { useVehicles } from '../vehicle/vehicleHooks';
import type { TripRequest, TripResponse } from '../../types/trip';

interface TripFormProps {
  initialData?: TripResponse | null;
  onSubmit: (data: TripRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [plannedTime, setPlannedTime] = useState('');
  const [driverId, setDriverId] = useState<number | null>(null);
  const [vehicleId, setVehicleId] = useState<number | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  // Load available drivers for optional assignment
  const { data: driverPage } = useDriverSearch({ status: 'AVAILABLE', size: 100 });
  const driversList = driverPage?.content || [];

  // Load available vehicles for optional assignment
  const { data: vehiclePage } = useVehicles({ status: 'AVAILABLE', size: 100 });
  const vehiclesList = vehiclePage?.content || [];

  useEffect(() => {
    if (initialData) {
      setTripName(initialData.tripName || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'MEDIUM');
      setSource(initialData.source || '');
      setDestination(initialData.destination || '');
      setCargoType(initialData.cargoType || '');
      setCargoWeight(initialData.cargoWeight ? String(initialData.cargoWeight) : '');
      setPlannedDate(initialData.plannedDate || '');
      // Format time to HH:mm (removing seconds if present)
      const timeRaw = initialData.plannedTime || '';
      setPlannedTime(timeRaw.length > 5 ? timeRaw.substring(0, 5) : timeRaw);
      setDriverId(initialData.driverId || null);
      setVehicleId(initialData.vehicleId || null);
    } else {
      // Set defaults for a new trip
      const today = new Date().toISOString().split('T')[0];
      setPlannedDate(today);
      setPlannedTime('08:00');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!tripName.trim() || !source.trim() || !destination.trim() || !cargoType.trim() || !cargoWeight.trim() || !plannedDate || !plannedTime) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const weightNum = parseFloat(cargoWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setFormError('Cargo weight must be a positive number.');
      return;
    }

    const requestPayload: TripRequest = {
      tripName,
      description: description.trim() || undefined,
      priority,
      source,
      destination,
      cargoType,
      cargoWeight: weightNum,
      plannedDate,
      plannedTime: plannedTime + ':00', // Append seconds for localTime format
      driverId,
      vehicleId
    };

    onSubmit(requestPayload).catch((err: any) => {
      setFormError(err?.response?.data?.message || 'An error occurred while saving the trip.');
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            required
            fullWidth
            label="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="trip-priority-label">Priority</InputLabel>
            <Select
              labelId="trip-priority-label"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description / Cargo Specifications"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Source Location"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Destination Location"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Cargo Type"
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="number"
            label="Cargo Weight (Tons)"
            value={cargoWeight}
            onChange={(e) => setCargoWeight(e.target.value)}
            inputProps={{ min: '0', step: 'any' }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="date"
            label="Planned Date"
            InputLabelProps={{ shrink: true }}
            value={plannedDate}
            onChange={(e) => setPlannedDate(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="time"
            label="Planned Time"
            InputLabelProps={{ shrink: true }}
            value={plannedTime}
            onChange={(e) => setPlannedTime(e.target.value)}
          />
        </Grid>

        {/* Optional initial assignments for draft trips */}
        {!initialData && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                Initial Assignments (Optional)
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="form-driver-label">Assign Driver</InputLabel>
                <Select
                  labelId="form-driver-label"
                  value={driverId || ''}
                  label="Assign Driver"
                  onChange={(e) => setDriverId(e.target.value ? Number(e.target.value) : null)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {driversList.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.fullName} (Score: {d.safetyScore})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="form-vehicle-label">Assign Vehicle</InputLabel>
                <Select
                  labelId="form-vehicle-label"
                  value={vehicleId || ''}
                  label="Assign Vehicle"
                  onChange={(e) => setVehicleId(e.target.value ? Number(e.target.value) : null)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {vehiclesList.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.registrationNumber} (Cap: {v.capacity}t)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
      </Grid>

      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Trip' : 'Create Trip'}
        </Button>
      </Stack>
    </Box>
  );
};
export default TripForm;
