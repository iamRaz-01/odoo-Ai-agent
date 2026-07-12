import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DescriptionIcon from '@mui/icons-material/Description';

interface FleetHealthCardProps {
  score: number;
  breakdownCount: number;
  overdueCount: number;
  expiredDocsCount: number;
}

export const FleetHealthCard: React.FC<FleetHealthCardProps> = ({
  score,
  breakdownCount,
  overdueCount,
  expiredDocsCount
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 90) return '#4caf50'; // Green
    if (val >= 70) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const color = getScoreColor(score);

  return (
    <Card sx={{ height: '100%' }} elevation={1}>
      <CardContent>
        <Typography color="text.secondary" variant="overline" sx={{ fontWeight: 'bold' }}>
          Fleet Health Score
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
              <CircularProgress
                variant="determinate"
                value={score}
                size={110}
                thickness={6}
                sx={{ color }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {score}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Score
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReportProblemIcon color={breakdownCount > 0 ? "error" : "action"} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {breakdownCount} Breakdowns
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FavoriteIcon color={overdueCount > 0 ? "warning" : "action"} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {overdueCount} Overdue Maintenance
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon color={expiredDocsCount > 0 ? "error" : "action"} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {expiredDocsCount} Expired Docs
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
