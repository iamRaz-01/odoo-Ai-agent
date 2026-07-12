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
  TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VehicleStatusChip } from './VehicleStatusChip';
import { useAuthStore } from '../../store/authStore';
import type { VehicleResponse } from '../../types/fleet';

interface VehicleTableProps {
  vehicles: VehicleResponse[];
  loading: boolean;
  onEdit: (vehicle: VehicleResponse) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onRequestSort: (property: string) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  loading,
  onEdit,
  onDelete,
  onViewDetails,
  sortBy,
  sortOrder,
  onRequestSort
}) => {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  const canModify = userRole === 'ADMIN' || userRole === 'FLEET_MANAGER';

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

  if (vehicles.length === 0) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography color="text.secondary">No vehicles found matching the criteria.</Typography>
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
                active={sortBy === 'registrationNumber'}
                direction={sortBy === 'registrationNumber' ? sortOrder : 'asc'}
                onClick={createSortHandler('registrationNumber')}
              >
                Registration No.
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'status'}
                direction={sortBy === 'status' ? sortOrder : 'asc'}
                onClick={createSortHandler('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>Vehicle Type</TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortBy === 'capacity'}
                direction={sortBy === 'capacity' ? sortOrder : 'asc'}
                onClick={createSortHandler('capacity')}
              >
                Capacity (tons)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortBy === 'odometer'}
                direction={sortBy === 'odometer' ? sortOrder : 'asc'}
                onClick={createSortHandler('odometer')}
              >
                Odometer (km)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Acquisition Cost</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} hover>
              <TableCell sx={{ fontWeight: 'bold' }}>{vehicle.registrationNumber}</TableCell>
              <TableCell>
                <VehicleStatusChip status={vehicle.status} />
              </TableCell>
              <TableCell>{vehicle.vehicleType?.description ?? vehicle.vehicleType?.name}</TableCell>
              <TableCell align="right">{vehicle.capacity.toFixed(2)}</TableCell>
              <TableCell align="right">{vehicle.odometer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="right">${vehicle.acquisitionCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="View details & documents">
                    <IconButton size="small" onClick={() => onViewDetails(vehicle.id)} color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {canModify && (
                    <>
                      <Tooltip title={vehicle.status === 'RETIRED' && userRole !== 'ADMIN' ? "Only Admin can edit retired vehicle" : "Edit vehicle"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onEdit(vehicle)}
                            color="secondary"
                            disabled={vehicle.status === 'RETIRED' && userRole !== 'ADMIN'}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={vehicle.status === 'RETIRED' && userRole !== 'ADMIN' ? "Only Admin can delete retired vehicle" : "Delete vehicle"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onDelete(vehicle.id)}
                            color="error"
                            disabled={vehicle.status === 'RETIRED' && userRole !== 'ADMIN'}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
