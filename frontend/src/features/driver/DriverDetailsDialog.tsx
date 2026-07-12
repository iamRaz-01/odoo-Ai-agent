import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DriverCard } from './DriverCard';
import type { DriverResponse } from '../../types/driver';

interface DriverDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  driver?: DriverResponse;
}

export const DriverDetailsDialog: React.FC<DriverDetailsDialogProps> = ({ open, onClose, driver }) => {
  if (!driver) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Driver Information Profile</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <DriverCard driver={driver} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DriverDetailsDialog;
