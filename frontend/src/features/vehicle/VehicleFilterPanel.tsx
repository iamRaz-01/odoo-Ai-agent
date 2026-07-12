import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Box,
  Typography
} from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import type { VehicleTypeResponse } from '../../types/fleet';

interface VehicleFilterPanelProps {
  search: string;
  status: string;
  typeId: number;
  vehicleTypes: VehicleTypeResponse[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: number) => void;
  onReset: () => void;
}

export const VehicleFilterPanel: React.FC<VehicleFilterPanelProps> = ({
  search,
  status,
  typeId,
  vehicleTypes,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onReset
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
        Filter Vehicles
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            id="filter-search"
            label="Search Registration Number"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            id="filter-status"
            label="Status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="RESERVED">Reserved</MenuItem>
            <MenuItem value="ON_TRIP">On Trip</MenuItem>
            <MenuItem value="IN_SHOP">In Shop</MenuItem>
            <MenuItem value="BREAKDOWN">Breakdown</MenuItem>
            <MenuItem value="RETIRED">Retired</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            id="filter-type"
            label="Vehicle Type"
            value={typeId || ''}
            onChange={(e) => onTypeChange(Number(e.target.value))}
          >
            <MenuItem value={0}>All Types</MenuItem>
            {vehicleTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.description || type.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              fullWidth
              variant="outlined"
              size="medium"
              startIcon={<ClearAllIcon />}
              onClick={onReset}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
