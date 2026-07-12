import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Button
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import type { AlertResponse } from '../../types/fleet';

interface FleetAlertsCardProps {
  documentAlerts: AlertResponse[];
  maintenanceAlerts: AlertResponse[];
}

export const FleetAlertsCard: React.FC<FleetAlertsCardProps> = ({
  documentAlerts,
  maintenanceAlerts
}) => {
  const navigate = useNavigate();
  const allAlerts = [
    ...documentAlerts,
    ...maintenanceAlerts
  ];

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={1}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography color="text.secondary" variant="overline" sx={{ fontWeight: 'bold' }}>
            Critical Alerts ({allAlerts.length})
          </Typography>
        </Box>
        {allAlerts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, py: 4 }}>
            <Typography color="text.secondary" variant="body2">
              No critical alerts or warnings active.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto', maxHeight: 280, flexGrow: 1 }}>
            {allAlerts.map((alert, idx) => {
              const isExpired = alert.type === 'DOCUMENT_EXPIRED';
              return (
                <React.Fragment key={`${alert.id}-${idx}`}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                        onClick={() => navigate(`/fleet/vehicles/${alert.vehicleId}`)}
                      >
                        Resolve
                      </Button>
                    }
                    sx={{ px: 0, py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      {isExpired ? (
                        <ErrorOutlineIcon color="error" />
                      ) : (
                        <WarningAmberIcon color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isExpired ? 'error.main' : 'warning.main' }}>
                          {alert.registrationNumber} - {isExpired ? 'Expired' : 'Expiring Soon'}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {alert.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {idx < allAlerts.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
