import React from 'react';
import { Chip } from '@mui/material';
import type { DriverStatus } from '../../types/driver';

interface DriverStatusChipProps {
  status: DriverStatus;
}

export const DriverStatusChip: React.FC<DriverStatusChipProps> = ({ status }) => {
  const getStatusConfig = (status: DriverStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'Available', color: 'success' as const, variant: 'outlined' as const };
      case 'ASSIGNED':
        return { label: 'Assigned', color: 'primary' as const, variant: 'outlined' as const };
      case 'ON_TRIP':
        return { label: 'On Trip', color: 'warning' as const, variant: 'outlined' as const };
      case 'OFF_DUTY':
        return { label: 'Off Duty', color: 'default' as const, variant: 'outlined' as const };
      case 'SUSPENDED':
        return { label: 'Suspended', color: 'error' as const, variant: 'filled' as const };
      case 'INACTIVE':
        return { label: 'Inactive', color: 'default' as const, variant: 'filled' as const };
      default:
        return { label: status, color: 'default' as const, variant: 'outlined' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={config.variant}
      size="small"
      sx={{ fontWeight: 'bold' }}
    />
  );
};
export default DriverStatusChip;
