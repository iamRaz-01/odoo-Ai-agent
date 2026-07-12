import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RouteIcon from '@mui/icons-material/AltRoute';
import AlertIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';

export function DispatcherDashboard() {
  const navigate = useNavigate();

  // Mock Active Assignments
  const activeDispatches = [
    { id: 'TRIP-4820', route: 'Chicago -> New York', driver: 'William Howard', status: 'IN_TRANSIT', time: 'Arriving in 2h' },
    { id: 'TRIP-4821', route: 'Houston -> Los Angeles', driver: 'George Miller', status: 'DELAYED', time: 'Delayed by 45m' },
    { id: 'TRIP-4822', route: 'Phoenix -> Denver', driver: 'Robert Brown', status: 'ASSIGNED', time: 'Departs in 30m' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Dispatcher Workstation
        </Typography>
        <Typography color="text.secondary">
          Coordinate route schedules, track ongoing trips, and manage active driver assignments.
        </Typography>
      </Box>

      {/* KPI Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Active Trips
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    8
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                  <DirectionsBusIcon />
                </Avatar>
              </Stack>
              <Chip label="Track Active Routes" size="small" onClick={() => navigate('/trips')} sx={{ mt: 1.5, cursor: 'pointer' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Available Drivers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    12
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                  <GroupIcon />
                </Avatar>
              </Stack>
              <Chip label="Check Availability" size="small" onClick={() => navigate('/drivers')} sx={{ mt: 1.5, cursor: 'pointer' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Ready Vehicles
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    9
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <DirectionsCarIcon />
                </Avatar>
              </Stack>
              <Chip label="Fleet Status" size="small" onClick={() => navigate('/fleet/vehicles')} sx={{ mt: 1.5, cursor: 'pointer' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Pending Dispatches
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    3
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                  <EventNoteIcon />
                </Avatar>
              </Stack>
              <Chip label="Needs Assignment" size="small" color="warning" sx={{ mt: 1.5, fontWeight: 'bold' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Dispatch List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Current Active Assignments
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                {activeDispatches.map((dispatch) => (
                  <ListItem key={dispatch.id} disableGutters divider>
                    <ListItemIcon>
                      <RouteIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${dispatch.id}: ${dispatch.route}`}
                      secondary={`Assigned Driver: ${dispatch.driver} • ${dispatch.time}`}
                    />
                    <Chip
                      label={dispatch.status.replace('_', ' ')}
                      color={dispatch.status === 'DELAYED' ? 'error' : dispatch.status === 'ASSIGNED' ? 'info' : 'success'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Operations */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Dispatch Operations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EventNoteIcon />}
                  onClick={() => navigate('/trips')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Create Trip Schedule
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  onClick={() => navigate('/safety/drivers')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Driver Availability Panel
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DirectionsCarIcon />}
                  onClick={() => navigate('/fleet/vehicles')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Inspect Fleet Vehicles
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsTransit';
export default DispatcherDashboard;
