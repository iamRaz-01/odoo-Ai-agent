import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  Typography,
  TableSortLabel,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { TripStatusChip } from './TripStatusChip';
import { useAuthStore } from '../../store/authStore';
import type { TripResponse } from '../../types/trip';

interface TripTableProps {
  trips: TripResponse[];
  loading: boolean;
  onEdit: (trip: TripResponse) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
  onAssign: (trip: TripResponse) => void;
  onStart: (id: number) => void;
  onComplete: (id: number) => void;
  onCancelTrip: (id: number) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onRequestSort: (property: string) => void;
}

export const TripTable: React.FC<TripTableProps> = ({
  trips,
  loading,
  onEdit,
  onDelete,
  onViewDetails,
  onAssign,
  onStart,
  onComplete,
  onCancelTrip,
  sortBy,
  sortOrder,
  onRequestSort
}) => {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  
  const isFleetOrAdmin = userRole === 'ADMIN' || userRole === 'FLEET_MANAGER';
  const isDriverOrAdmin = userRole === 'ADMIN' || userRole === 'DRIVER';

  const createSortHandler = (property: string) => () => {
    onRequestSort(property);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (trips.length === 0) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography color="text.secondary">No trips found matching the criteria.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'tripNumber'}
                direction={sortBy === 'tripNumber' ? sortOrder : 'asc'}
                onClick={createSortHandler('tripNumber')}
              >
                Trip ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'tripName'}
                direction={sortBy === 'tripName' ? sortOrder : 'asc'}
                onClick={createSortHandler('tripName')}
              >
                Trip Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Route</TableCell>
            <TableCell>Cargo (Tons)</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'plannedDate'}
                direction={sortBy === 'plannedDate' ? sortOrder : 'asc'}
                onClick={createSortHandler('plannedDate')}
              >
                Schedule
              </TableSortLabel>
            </TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'status'}
                direction={sortBy === 'status' ? sortOrder : 'asc'}
                onClick={createSortHandler('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((trip) => {
            const isDraft = trip.status === 'DRAFT';
            const isAssigned = trip.status === 'ASSIGNED';
            const isInProgress = trip.status === 'IN_PROGRESS';
            const isCompleted = trip.status === 'COMPLETED';
            const isCancelled = trip.status === 'CANCELLED';

            return (
              <TableRow key={trip.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{trip.tripNumber}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {trip.tripName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Priority: {trip.priority}
                  </Typography>
                </TableCell>
                <TableCell>{trip.source} → {trip.destination}</TableCell>
                <TableCell>
                  <Typography variant="body2">{trip.cargoType}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {trip.cargoWeight} tons
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{trip.plannedDate}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {trip.plannedTime.substring(0, 5)}
                  </Typography>
                </TableCell>
                <TableCell>{trip.driverName || <Typography variant="caption" color="text.secondary">Unassigned</Typography>}</TableCell>
                <TableCell>{trip.vehicleRegistrationNumber || <Typography variant="caption" color="text.secondary">Unassigned</Typography>}</TableCell>
                <TableCell>
                  <TripStatusChip status={trip.status} />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="View Trip Analytics & Details">
                      <IconButton size="small" onClick={() => onViewDetails(trip.id)} color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Fleet Manager / Admin Actions */}
                    {isFleetOrAdmin && (
                      <>
                        <Tooltip title="Edit Trip Details">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onEdit(trip)}
                              color="secondary"
                              disabled={isCompleted || isCancelled}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Assign Driver & Vehicle">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onAssign(trip)}
                              color="info"
                              disabled={isCompleted || isCancelled}
                            >
                              <AssignmentIndIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Cancel Trip">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onCancelTrip(trip.id)}
                              color="error"
                              disabled={isCompleted || isCancelled}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Delete Trip">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(trip.id)}
                              color="error"
                              disabled={!isDraft && !isCancelled}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </>
                    )}

                    {/* Driver Actions */}
                    {isDriverOrAdmin && (
                      <>
                        {isAssigned && (
                          <Tooltip title="Start Trip">
                            <IconButton size="small" onClick={() => onStart(trip.id)} color="warning">
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {isInProgress && (
                          <Tooltip title="Complete Trip">
                            <IconButton size="small" onClick={() => onComplete(trip.id)} color="success">
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default TripTable;
