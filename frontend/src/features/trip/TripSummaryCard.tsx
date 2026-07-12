import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface TripSummaryCardProps {
  stats: {
    total: number;
    draft: number;
    assigned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Trips',
      value: stats.total,
      icon: <ListAltIcon fontSize="large" color="primary" />,
      color: 'primary.main'
    },
    {
      title: 'Draft',
      value: stats.draft,
      icon: <AssignmentIcon fontSize="large" color="action" />,
      color: 'text.secondary'
    },
    {
      title: 'Active / Assigned',
      value: stats.assigned + stats.inProgress,
      icon: <LocalShippingIcon fontSize="large" color="warning" />,
      color: 'warning.main'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircleIcon fontSize="large" color="success" />,
      color: 'success.main'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: <CancelIcon fontSize="large" color="error" />,
      color: 'error.main'
    }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={card.title}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: card.color }}>
                  {card.value}
                </Typography>
              </Box>
              <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 2 }}>
                {card.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default TripSummaryCard;
