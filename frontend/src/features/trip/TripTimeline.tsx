import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Box,
  Paper
} from '@mui/material';
import type { TripStatus } from '../../types/trip';

interface TripTimelineProps {
  status: TripStatus;
  driverName?: string;
  vehicleRegistrationNumber?: string;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({
  status,
  driverName,
  vehicleRegistrationNumber
}) => {
  const steps = [
    {
      label: 'Draft Created',
      description: 'Trip details defined. Waiting for vehicle & driver assignments.',
      completedStatus: ['DRAFT', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
    },
    {
      label: 'Resource Assigned',
      description: driverName && vehicleRegistrationNumber 
        ? `Assigned to driver ${driverName} with vehicle ${vehicleRegistrationNumber}.`
        : 'Resources are being allocated by the Fleet Manager.',
      completedStatus: ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
    },
    {
      label: 'In Progress',
      description: 'The driver started the trip. Cargo is in transit.',
      completedStatus: ['IN_PROGRESS', 'COMPLETED']
    },
    {
      label: status === 'CANCELLED' ? 'Cancelled' : 'Completed',
      description: status === 'CANCELLED' 
        ? 'The trip has been cancelled. Resources released.'
        : status === 'COMPLETED' 
          ? 'Cargo successfully delivered. Trip closed.'
          : 'Delivered at destination.',
      completedStatus: ['COMPLETED', 'CANCELLED']
    }
  ];

  // Determine active step index
  const getActiveStep = () => {
    if (status === 'CANCELLED') return 3;
    if (status === 'COMPLETED') return 4;
    if (status === 'IN_PROGRESS') return 2;
    if (status === 'ASSIGNED') return 1;
    return 0; // DRAFT
  };

  const activeStep = getActiveStep();

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => {
          const isCurrentCancelled = status === 'CANCELLED' && index === 3;
          
          return (
            <Step key={step.label} expanded>
              <StepLabel
                error={isCurrentCancelled}
                optional={
                  index === activeStep ? (
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                      Current Stage
                    </Typography>
                  ) : null
                }
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
export default TripTimeline;
