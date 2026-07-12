import React from 'react';
import { Grid } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CancelIcon from '@mui/icons-material/Cancel';
import { FleetSummaryCard } from './FleetSummaryCard';
import type { FleetSummaryResponse } from '../../types/fleet';

interface FleetOverviewGridProps {
  summary: FleetSummaryResponse;
}

export const FleetOverviewGrid: React.FC<FleetOverviewGridProps> = ({ summary }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="Total Fleet"
          value={summary.totalFleet}
          icon={<DirectionsCarIcon fontSize="large" />}
          color="#1976d2"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="Active Fleet"
          value={summary.activeVehicles}
          icon={<CheckCircleIcon fontSize="large" />}
          color="#4caf50"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="Available"
          value={summary.availableVehicles}
          icon={<EventAvailableIcon fontSize="large" />}
          color="#2e7d32"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="Reserved"
          value={summary.reservedVehicles}
          icon={<BookmarkIcon fontSize="large" />}
          color="#0288d1"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="On Trip"
          value={summary.onTrip}
          icon={<LocalShippingIcon fontSize="large" />}
          color="#0288d1"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="In Shop"
          value={summary.maintenance}
          icon={<BuildIcon fontSize="large" />}
          color="#ed6c02"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="Breakdowns"
          value={summary.breakdown}
          icon={<ReportProblemIcon fontSize="large" />}
          color="#d32f2f"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <FleetSummaryCard
          title="Retired"
          value={summary.retired}
          icon={<CancelIcon fontSize="large" />}
          color="#9e9e9e"
        />
      </Grid>
    </Grid>
  );
};
