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
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DriverStatusChip } from './DriverStatusChip';
import { useAuthStore } from '../../store/authStore';
import type { DriverResponse } from '../../types/driver';

interface DriverTableProps {
  drivers: DriverResponse[];
  loading: boolean;
  onEdit: (driver: DriverResponse) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
  onActivate: (id: number) => void;
  onSuspend: (id: number) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onRequestSort: (property: string) => void;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  loading,
  onEdit,
  onDelete,
  onViewDetails,
  onActivate,
  onSuspend,
  sortBy,
  sortOrder,
  onRequestSort
}) => {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  const canModify = userRole === 'ADMIN' || userRole === 'SAFETY_OFFICER';

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

  if (drivers.length === 0) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography color="text.secondary">No drivers found matching the criteria.</Typography>
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
                active={sortBy === 'fullName'}
                direction={sortBy === 'fullName' ? sortOrder : 'asc'}
                onClick={createSortHandler('fullName')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>License Number</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'licenseExpiry'}
                direction={sortBy === 'licenseExpiry' ? sortOrder : 'asc'}
                onClick={createSortHandler('licenseExpiry')}
              >
                License Expiry
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortBy === 'safetyScore'}
                direction={sortBy === 'safetyScore' ? sortOrder : 'asc'}
                onClick={createSortHandler('safetyScore')}
              >
                Safety Score
              </TableSortLabel>
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id} hover>
              <TableCell sx={{ fontWeight: 'bold' }}>{driver.fullName}</TableCell>
              <TableCell>{driver.licenseNumber}</TableCell>
              <TableCell>{driver.licenseCategory}</TableCell>
              <TableCell>{driver.licenseExpiry}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                {driver.safetyScore}
              </TableCell>
              <TableCell>
                <DriverStatusChip status={driver.status} />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <Tooltip title="View details">
                    <IconButton size="small" onClick={() => onViewDetails(driver.id)} color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {canModify && (
                    <>
                      <Tooltip title="Edit driver profile">
                        <IconButton size="small" onClick={() => onEdit(driver)} color="secondary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {driver.status === 'SUSPENDED' ? (
                        <Tooltip title="Activate / Unsuspend driver">
                          <IconButton size="small" onClick={() => onActivate(driver.id)} color="success">
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Suspend driver">
                          <IconButton
                            size="small"
                            onClick={() => onSuspend(driver.id)}
                            color="warning"
                            disabled={driver.status === 'ON_TRIP'}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete driver record">
                        <IconButton size="small" onClick={() => onDelete(driver.id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
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
export default DriverTable;
