import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface FleetUtilizationCardProps {
  utilization: number;
}

export const FleetUtilizationCard: React.FC<FleetUtilizationCardProps> = ({ utilization }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={1}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: '100%' }}>
            <Typography color="text.secondary" variant="overline" sx={{ fontWeight: 'bold' }}>
              Fleet Utilization
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1 }}>
              {utilization}%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={utilization}
                  color="info"
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </Box>
            <Typography color="text.secondary" variant="caption" sx={{ mt: 1, display: 'block' }}>
              Percentage of active fleet currently on trip
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
