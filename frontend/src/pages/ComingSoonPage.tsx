import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export const ComingSoonPage: React.FC = () => {
  return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <HourglassEmptyIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
      </Box>
      <Typography variant="h3" gutterBottom>
        Coming Soon
      </Typography>
      <Typography sx={{ my: 2 }} color="text.secondary">
        This module is scheduled for development in a future milestone. Thank you for your patience!
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained" sx={{ mt: 2 }}>
        Return to Dashboard
      </Button>
    </Container>
  );
};
