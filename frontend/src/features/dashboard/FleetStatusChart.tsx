import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { FleetSummaryResponse } from '../../types/fleet';

interface FleetStatusChartProps {
  summary: FleetSummaryResponse;
}

export const FleetStatusChart: React.FC<FleetStatusChartProps> = ({ summary }) => {
  const data = [
    { name: 'Available', value: summary.availableVehicles, color: '#4caf50' },
    { name: 'Reserved', value: summary.reservedVehicles, color: '#1976d2' },
    { name: 'On Trip', value: summary.onTrip, color: '#0288d1' },
    { name: 'In Shop', value: summary.maintenance, color: '#ed6c02' },
    { name: 'Breakdown', value: summary.breakdown, color: '#d32f2f' },
    { name: 'Retired', value: summary.retired, color: '#9e9e9e' }
  ].filter(item => item.value > 0); // only show statuses with values

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={1}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography color="text.secondary" variant="overline" sx={{ fontWeight: 'bold', mb: 2 }}>
          Vehicle Status Distribution
        </Typography>
        {data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: 220 }}>
            <Typography color="text.secondary">No vehicle data available</Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 220, flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} Vehicles`]}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: '11px', color: '#666' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
