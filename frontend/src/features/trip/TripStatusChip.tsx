import React from 'react';
import { Chip } from '@mui/material';
import type { TripStatus } from '../../types/trip';

interface TripStatusChipProps {
  status: TripStatus;
  size?: 'small' | 'medium';
}

export const TripStatusChip: React.FC<TripStatusChipProps> = ({ status, size = 'small' }) => {
  const getStatusColor = (statusVal: TripStatus) => {
    switch (statusVal) {
      case 'DRAFT':
        return 'default';
      case 'ASSIGNED':
        return 'info';
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status.replace('_', ' ')}
      color={getStatusColor(status)}
      size={size}
      sx={{ fontWeight: 'bold' }}
    />
  );
};
export default TripStatusChip;
