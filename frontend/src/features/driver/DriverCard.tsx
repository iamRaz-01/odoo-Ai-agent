import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Box } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StarIcon from '@mui/icons-material/Star';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { DriverStatusChip } from './DriverStatusChip';
import { DriverAvailabilityBadge } from './DriverAvailabilityBadge';
import type { DriverResponse } from '../../types/driver';

interface DriverCardProps {
  driver: DriverResponse;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {driver.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {driver.id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
            <DriverStatusChip status={driver.status} />
            <DriverAvailabilityBadge driverId={driver.id} />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <BadgeIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  License Details
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {driver.licenseNumber} ({driver.licenseCategory})
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <DateRangeIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  License Expiry
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {driver.licenseExpiry}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Phone Number
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {driver.phoneNumber}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Email Address
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {driver.email || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StarIcon sx={{ color: '#faaf00' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Safety Rating Score
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {driver.safetyScore} / 100
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ContactPhoneIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Emergency Contact
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {driver.emergencyContact || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default DriverCard;
