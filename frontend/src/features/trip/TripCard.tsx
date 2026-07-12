import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { TripStatusChip } from './TripStatusChip';
import type { TripResponse } from '../../types/trip';

interface TripCardProps {
  trip: TripResponse;
  onViewDetails?: (id: number) => void;
  onStart?: (id: number) => void;
  onComplete?: (id: number) => void;
  userRole?: string;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onViewDetails,
  onStart,
  onComplete,
  userRole
}) => {
  const isAssigned = trip.status === 'ASSIGNED';
  const isInProgress = trip.status === 'IN_PROGRESS';
  const isDriverOrAdmin = userRole === 'ADMIN' || userRole === 'DRIVER';

  return (
    <Card
      elevation={2}
      sx={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        borderRadius: 2
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {trip.tripNumber}
          </Typography>
          <TripStatusChip status={trip.status} />
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }} noWrap>
          {trip.tripName}
        </Typography>

        {/* Route Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">Source</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }} noWrap>{trip.source}</Typography>
          </Box>
          <ArrowForwardIcon sx={{ mx: 2, color: 'text.secondary' }} fontSize="small" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">Destination</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }} noWrap>{trip.destination}</Typography>
          </Box>
        </Box>

        {/* Schedule */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2">{trip.plannedDate}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2">{trip.plannedTime.substring(0, 5)}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {/* Resources */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingIcon fontSize="small" color="action" />
            <Typography variant="body2" color={trip.vehicleRegistrationNumber ? 'text.primary' : 'text.secondary'}>
              {trip.vehicleRegistrationNumber || 'No vehicle assigned'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color={trip.driverName ? 'text.primary' : 'text.secondary'}>
              {trip.driverName || 'No driver assigned'}
            </Typography>
          </Box>
        </Stack>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {onViewDetails ? (
            <Button
              size="small"
              onClick={() => onViewDetails(trip.id)}
              endIcon={<ChevronRightIcon />}
            >
              Details
            </Button>
          ) : (
            <div />
          )}

          {isDriverOrAdmin && isAssigned && onStart && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={() => onStart(trip.id)}
            >
              Start Trip
            </Button>
          )}

          {isDriverOrAdmin && isInProgress && onComplete && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => onComplete(trip.id)}
            >
              Complete
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
export default TripCard;
