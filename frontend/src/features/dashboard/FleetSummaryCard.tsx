import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

interface FleetSummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtext?: string;
}

export const FleetSummaryCard: React.FC<FleetSummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  subtext
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={1}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="text.secondary" variant="overline" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1 }}>
              {value}
            </Typography>
            {subtext && (
              <Typography color="text.secondary" variant="body2">
                {subtext}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};
