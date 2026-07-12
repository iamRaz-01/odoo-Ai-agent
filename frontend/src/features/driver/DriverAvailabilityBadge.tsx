import React from 'react';
import { Tooltip, Chip, CircularProgress, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDriverAvailability } from './driverHooks';

interface DriverAvailabilityBadgeProps {
  driverId: number;
}

export const DriverAvailabilityBadge: React.FC<DriverAvailabilityBadgeProps> = ({ driverId }) => {
  const { data: availability, isLoading } = useDriverAvailability(driverId);

  if (isLoading) {
    return <CircularProgress size={16} />;
  }

  if (!availability) {
    return null;
  }

  return (
    <Box>
      {availability.available ? (
        <Tooltip title="Ready for dispatch and trips assignment.">
          <Chip
            icon={<CheckCircleIcon style={{ color: '#2e7d32' }} />}
            label="Eligible"
            size="small"
            sx={{
              bgcolor: 'success.light',
              color: 'success.dark',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'success.dark' }
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title={availability.reason || 'Not ready for dispatch.'}>
          <Chip
            icon={<CancelIcon style={{ color: '#d32f2f' }} />}
            label="Ineligible"
            size="small"
            sx={{
              bgcolor: 'error.light',
              color: 'error.dark',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: 'error.dark' }
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};
export default DriverAvailabilityBadge;
