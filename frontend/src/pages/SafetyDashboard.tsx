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
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';

export function SafetyDashboard() {
  const navigate = useNavigate();

  // Mock Compliance Items
  const pendingActions = [
    { id: 1, text: 'Verify CDL License for John Doe', type: 'LICENSE_EXPIRY', urgency: 'HIGH' },
    { id: 2, text: 'Review incident log for vehicle REG-1200', type: 'COLLISION_INCIDENT', urgency: 'HIGH' },
    { id: 3, text: 'Confirm training session completion for William Howard', type: 'TRAINING_LOG', urgency: 'MEDIUM' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Safety & Compliance Station
        </Typography>
        <Typography color="text.secondary">
          Monitor commercial driver credentials validation, incident audits, and vehicle safety logs.
        </Typography>
      </Box>

      {/* Overview stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Safety Rating (Avg)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    94.2%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                  <HealthAndSafetyIcon />
                </Avatar>
              </Stack>
              <Chip label="Good Standings" color="success" size="small" variant="outlined" sx={{ mt: 1.5, fontWeight: 'bold' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    CDL Verifications
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    5
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                  <VerifiedUserIcon />
                </Avatar>
              </Stack>
              <Chip label="Verify Licenses" size="small" onClick={() => navigate('/safety/drivers')} sx={{ mt: 1.5, cursor: 'pointer' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Active Incidents
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    1
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
                  <WarningAmberIcon />
                </Avatar>
              </Stack>
              <Chip label="Requires Audit" color="error" size="small" variant="outlined" sx={{ mt: 1.5, fontWeight: 'bold' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Inspection Status
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    98.5%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <AssignmentLateIcon />
                </Avatar>
              </Stack>
              <Chip label="All Clear" color="success" size="small" variant="outlined" sx={{ mt: 1.5, fontWeight: 'bold' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Compliance checklist */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pending Safety Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                {pendingActions.map((action) => (
                  <ListItem key={action.id} disableGutters divider>
                    <ListItemIcon>
                      <WarningAmberIcon color={action.urgency === 'HIGH' ? 'error' : 'warning'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={action.text}
                      secondary={`Category: ${action.type.replace('_', ' ')}`}
                    />
                    <Chip
                      label={action.urgency}
                      color={action.urgency === 'HIGH' ? 'error' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Safety Tools */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Compliance Controls
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<VerifiedUserIcon />}
                  onClick={() => navigate('/safety/drivers')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Verify CDL Registry
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DirectionsCarIcon />}
                  onClick={() => navigate('/fleet/vehicles')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Document Inspections
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SchoolIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Safety Training Programs
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SafetyDashboard;
