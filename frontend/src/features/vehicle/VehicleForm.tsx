import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  CircularProgress
} from '@mui/material';
import type { VehicleResponse, VehicleTypeResponse } from '../../types/fleet';

const vehicleSchema = z.object({
  registrationNumber: z.string()
    .trim()
    .min(3, 'Registration number must be at least 3 characters.')
    .max(20, 'Registration number cannot exceed 20 characters.')
    .regex(/^[A-Za-z0-9\-]+$/, 'Registration number must contain only alphanumeric characters and hyphens.'),
  vehicleTypeId: z.number({ invalid_type_error: 'Vehicle type is required.' }).positive('Vehicle type is required.'),
  capacity: z.number({ invalid_type_error: 'Capacity is required.' }).positive('Capacity must be greater than zero.'),
  acquisitionCost: z.number({ invalid_type_error: 'Acquisition cost is required.' }).positive('Acquisition cost must be positive.'),
  odometer: z.number({ invalid_type_error: 'Odometer is required.' }).nonnegative('Odometer cannot be negative.'),
  status: z.enum(['AVAILABLE', 'RESERVED', 'ON_TRIP', 'IN_SHOP', 'BREAKDOWN', 'RETIRED'] as const, {
    required_error: 'Status is required.'
  })
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onSubmit: (values: VehicleFormValues) => void;
  initialValues?: VehicleResponse;
  vehicleTypes: VehicleTypeResponse[];
  isEdit?: boolean;
  isPending?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  initialValues,
  vehicleTypes,
  isEdit = false,
  isPending = false
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: initialValues?.registrationNumber ?? '',
      vehicleTypeId: initialValues?.vehicleType?.id ?? 0,
      capacity: initialValues?.capacity ?? 0,
      acquisitionCost: initialValues?.acquisitionCost ?? 0,
      odometer: initialValues?.odometer ?? 0,
      status: initialValues?.status ?? 'AVAILABLE'
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="registrationNumber"
            label="Registration Number"
            disabled={isEdit} // Immutable after creation
            {...register('registrationNumber')}
            error={!!errors.registrationNumber}
            helperText={errors.registrationNumber?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="vehicleTypeId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                required
                fullWidth
                id="vehicleTypeId"
                label="Vehicle Type"
                value={field.value || ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
                error={!!errors.vehicleTypeId}
                helperText={errors.vehicleTypeId?.message}
              >
                <MenuItem value={0} disabled>Select Type</MenuItem>
                {vehicleTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.description || type.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            type="number"
            id="capacity"
            label="Capacity (tons)"
            inputProps={{ step: '0.01', min: '0.01' }}
            {...register('capacity', { valueAsNumber: true })}
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            type="number"
            id="acquisitionCost"
            label="Acquisition Cost ($)"
            inputProps={{ step: '0.01', min: '0.01' }}
            {...register('acquisitionCost', { valueAsNumber: true })}
            error={!!errors.acquisitionCost}
            helperText={errors.acquisitionCost?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            type="number"
            id="odometer"
            label="Odometer (km)"
            inputProps={{ step: '0.1', min: '0' }}
            {...register('odometer', { valueAsNumber: true })}
            error={!!errors.odometer}
            helperText={errors.odometer?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                select
                required
                fullWidth
                id="status"
                label="Status"
                {...field}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="RESERVED">Reserved</MenuItem>
                <MenuItem value="ON_TRIP">On Trip</MenuItem>
                <MenuItem value="IN_SHOP">In Shop</MenuItem>
                <MenuItem value="BREAKDOWN">Breakdown</MenuItem>
                <MenuItem value="RETIRED">Retired</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          sx={{ minWidth: 100 }}
        >
          {isPending ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};
