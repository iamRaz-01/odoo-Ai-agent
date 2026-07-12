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
  status: z.enum([
    'AVAILABLE', 'RESERVED', 'ON_TRIP', 'IN_SHOP', 'BREAKDOWN', 'RETIRED',
    'PURCHASED', 'REGISTERED', 'ACTIVE', 'ASSIGNED', 'MAINTENANCE', 'RETURNED', 'DECOMMISSIONED'
  ] as const, {
    required_error: 'Status is required.'
  }),
  name: z.string().trim().max(100, 'Name cannot exceed 100 characters.').optional().or(z.literal('')),
  model: z.string().trim().max(100, 'Model cannot exceed 100 characters.').optional().or(z.literal('')),
  fuelType: z.string().trim().max(50, 'Fuel type cannot exceed 50 characters.').optional().or(z.literal('')),
  manufacturingYear: z.number().int().min(1900, 'Year must be after 1900.').max(2100, 'Year must be realistic.').optional().nullable(),
  engineNumber: z.string().trim().max(100, 'Engine number cannot exceed 100 characters.').optional().or(z.literal('')),
  chassisNumber: z.string().trim().max(100, 'Chassis number cannot exceed 100 characters.').optional().or(z.literal('')),
  assignedDepot: z.string().trim().max(100, 'Assigned depot cannot exceed 100 characters.').optional().or(z.literal('')),
  maximumCapacity: z.number().nonnegative('Maximum capacity cannot be negative.').optional().nullable(),
  driverId: z.number().int().positive('Driver ID must be positive.').optional().nullable(),
  fuelLevel: z.number().min(0, 'Fuel level cannot be negative.').max(100, 'Fuel level cannot exceed 100%.').optional().nullable()
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
      status: initialValues?.status ?? 'AVAILABLE',
      name: initialValues?.name ?? '',
      model: initialValues?.model ?? '',
      fuelType: initialValues?.fuelType ?? '',
      manufacturingYear: initialValues?.manufacturingYear ?? null,
      engineNumber: initialValues?.engineNumber ?? '',
      chassisNumber: initialValues?.chassisNumber ?? '',
      assignedDepot: initialValues?.assignedDepot ?? '',
      maximumCapacity: initialValues?.maximumCapacity ?? null,
      driverId: initialValues?.driverId ?? null,
      fuelLevel: initialValues?.fuelLevel ?? null
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
            disabled={isEdit}
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="name"
            label="Vehicle Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="model"
            label="Model"
            {...register('model')}
            error={!!errors.model}
            helperText={errors.model?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            type="number"
            id="capacity"
            label="Payload Capacity (tons)"
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="fuelType"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                id="fuelType"
                label="Fuel Type"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors.fuelType}
                helperText={errors.fuelType?.message}
              >
                <MenuItem value="">Not Specified</MenuItem>
                <MenuItem value="DIESEL">Diesel</MenuItem>
                <MenuItem value="PETROL">Petrol</MenuItem>
                <MenuItem value="CNG">Compressed Natural Gas (CNG)</MenuItem>
                <MenuItem value="ELECTRIC">Electric (EV)</MenuItem>
                <MenuItem value="HYBRID">Hybrid</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            id="manufacturingYear"
            label="Manufacturing Year"
            inputProps={{ min: '1900', max: '2100' }}
            {...register('manufacturingYear', { valueAsNumber: true })}
            error={!!errors.manufacturingYear}
            helperText={errors.manufacturingYear?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="engineNumber"
            label="Engine Number"
            {...register('engineNumber')}
            error={!!errors.engineNumber}
            helperText={errors.engineNumber?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="chassisNumber"
            label="Chassis Number"
            {...register('chassisNumber')}
            error={!!errors.chassisNumber}
            helperText={errors.chassisNumber?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="assignedDepot"
            label="Assigned Depot"
            {...register('assignedDepot')}
            error={!!errors.assignedDepot}
            helperText={errors.assignedDepot?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            id="maximumCapacity"
            label="Maximum Capacity (tons)"
            inputProps={{ step: '0.01', min: '0.00' }}
            {...register('maximumCapacity', { valueAsNumber: true })}
            error={!!errors.maximumCapacity}
            helperText={errors.maximumCapacity?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            id="driverId"
            label="Assigned Driver ID"
            {...register('driverId', { valueAsNumber: true })}
            error={!!errors.driverId}
            helperText={errors.driverId?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            id="fuelLevel"
            label="Fuel Level (%)"
            inputProps={{ step: '0.1', min: '0', max: '100' }}
            {...register('fuelLevel', { valueAsNumber: true })}
            error={!!errors.fuelLevel}
            helperText={errors.fuelLevel?.message}
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
                <MenuItem value="PURCHASED">Purchased</MenuItem>
                <MenuItem value="REGISTERED">Registered</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="RESERVED">Reserved</MenuItem>
                <MenuItem value="ON_TRIP">On Trip</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="IN_SHOP">In Shop</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="RETURNED">Returned</MenuItem>
                <MenuItem value="BREAKDOWN">Breakdown</MenuItem>
                <MenuItem value="DECOMMISSIONED">Decommissioned</MenuItem>
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
