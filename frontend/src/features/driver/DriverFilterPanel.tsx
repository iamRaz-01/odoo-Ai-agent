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
import type { DriverStatus } from '../../types/driver';

interface DriverFilterPanelProps {
  status: string;
  category: string;
  minSafetyScore: string;
  licenseExpiryBefore: string;
  licenseExpiryAfter: string;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMinSafetyScoreChange: (value: string) => void;
  onExpiryBeforeChange: (value: string) => void;
  onExpiryAfterChange: (value: string) => void;
  onReset: () => void;
}

export const DriverFilterPanel: React.FC<DriverFilterPanelProps> = ({
  status,
  category,
  minSafetyScore,
  licenseExpiryBefore,
  licenseExpiryAfter,
  onStatusChange,
  onCategoryChange,
  onMinSafetyScoreChange,
  onExpiryBeforeChange,
  onExpiryAfterChange,
  onReset
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
        Filter Drivers
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Driver Status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="ASSIGNED">Assigned</MenuItem>
            <MenuItem value="ON_TRIP">On Trip</MenuItem>
            <MenuItem value="OFF_DUTY">Off Duty</MenuItem>
            <MenuItem value="SUSPENDED">Suspended</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="License Category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="e.g. CLASS-A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Min Safety Score"
            value={minSafetyScore}
            onChange={(e) => onMinSafetyScoreChange(e.target.value)}
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="License Expiry After"
            InputLabelProps={{ shrink: true }}
            value={licenseExpiryAfter}
            onChange={(e) => onExpiryAfterChange(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="License Expiry Before"
              InputLabelProps={{ shrink: true }}
              value={licenseExpiryBefore}
              onChange={(e) => onExpiryBeforeChange(e.target.value)}
            />
            <Button
              variant="outlined"
              size="medium"
              onClick={onReset}
              sx={{ minWidth: 40, p: 1 }}
            >
              <ClearAllIcon />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default DriverFilterPanel;
