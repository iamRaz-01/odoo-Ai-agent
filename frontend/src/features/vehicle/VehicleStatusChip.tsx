import React from 'react';
import { Chip } from '@mui/material';
import type { VehicleStatus } from '../../types/fleet';

interface VehicleStatusChipProps {
  status: VehicleStatus;
}

export const VehicleStatusChip: React.FC<VehicleStatusChipProps> = ({ status }) => {
  const getStatusConfig = (status: VehicleStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'Available', color: 'success' as const };
      case 'RESERVED':
        return { label: 'Reserved', color: 'primary' as const };
      case 'ON_TRIP':
        return { label: 'On Trip', color: 'info' as const };
      case 'IN_SHOP':
        return { label: 'In Shop', color: 'warning' as const };
      case 'BREAKDOWN':
        return { label: 'Breakdown', color: 'error' as const };
      case 'RETIRED':
        return { label: 'Retired', color: 'default' as const };
      default:
        return { label: status, color: 'default' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 'medium' }}
    />
  );
};
