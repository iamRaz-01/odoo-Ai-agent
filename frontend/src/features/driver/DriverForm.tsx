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
import type { DriverResponse } from '../../types/driver';

const driverSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(120, 'Full name cannot exceed 120 characters.'),
  licenseNumber: z.string()
    .trim()
    .min(1, 'License number is required.')
    .max(50, 'License number cannot exceed 50 characters.'),
  licenseCategory: z.string()
    .trim()
    .min(1, 'License category is required.')
    .max(50, 'License category cannot exceed 50 characters.'),
  licenseExpiry: z.string().refine((val) => {
    if (!val) return false;
    const expiry = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry > today;
  }, { message: 'License expiry date must be in the future.' }),
  phoneNumber: z.string()
    .trim()
    .min(1, 'Phone number is required.')
    .regex(/^[+]?[0-9\s\-()]+$/, 'Phone number contains invalid characters.')
    .min(7, 'Phone number must be at least 7 characters.')
    .max(20, 'Phone number cannot exceed 20 characters.'),
  email: z.string().trim().email('Invalid email address.').max(100, 'Email cannot exceed 100 characters.').optional().or(z.literal('')),
  emergencyContact: z.string().trim().max(100, 'Emergency contact cannot exceed 100 characters.').optional().or(z.literal('')),
  safetyScore: z.coerce.number()
    .min(0, 'Safety score cannot be negative.')
    .max(100, 'Safety score cannot exceed 100.'),
  status: z.enum(['AVAILABLE', 'ASSIGNED', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED', 'INACTIVE'] as const, {
    required_error: 'Status is required.'
  })
});

export type DriverFormValues = z.infer<typeof driverSchema>;

interface DriverFormProps {
  onSubmit: (values: DriverFormValues) => void;
  initialValues?: DriverResponse;
  isEdit?: boolean;
  isPending?: boolean;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  onSubmit,
  initialValues,
  isEdit = false,
  isPending = false
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: initialValues?.fullName ?? '',
      licenseNumber: initialValues?.licenseNumber ?? '',
      licenseCategory: initialValues?.licenseCategory ?? '',
      licenseExpiry: initialValues?.licenseExpiry ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
      email: initialValues?.email ?? '',
      emergencyContact: initialValues?.emergencyContact ?? '',
      safetyScore: initialValues?.safetyScore ?? 100,
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
            id="fullName"
            label="Full Name"
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="licenseNumber"
            label="License Number"
            {...register('licenseNumber')}
            disabled={isEdit}
            error={!!errors.licenseNumber}
            helperText={isEdit ? 'License number is immutable after registration.' : errors.licenseNumber?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="licenseCategory"
            label="License Category"
            {...register('licenseCategory')}
            error={!!errors.licenseCategory}
            helperText={errors.licenseCategory?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            type="date"
            id="licenseExpiry"
            label="License Expiry"
            InputLabelProps={{ shrink: true }}
            {...register('licenseExpiry')}
            error={!!errors.licenseExpiry}
            helperText={errors.licenseExpiry?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            {...register('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="emergencyContact"
            label="Emergency Contact"
            {...register('emergencyContact')}
            error={!!errors.emergencyContact}
            helperText={errors.emergencyContact?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            required
            fullWidth
            type="number"
            id="safetyScore"
            label="Safety Score"
            {...register('safetyScore')}
            error={!!errors.safetyScore}
            helperText={errors.safetyScore?.message}
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                required
                fullWidth
                id="status"
                label="Status"
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="ON_TRIP">On Trip</MenuItem>
                <MenuItem value="OFF_DUTY">Off Duty</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
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
export default DriverForm;
