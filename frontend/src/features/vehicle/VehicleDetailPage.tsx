import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  DialogActions,
  DialogContentText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SettingsIcon from '@mui/icons-material/Settings';
import { useVehicle, useVehicleDocuments, useUploadDocument, useUpdateDocument, useDeleteDocument } from './vehicleHooks';
import { VehicleStatusChip } from './VehicleStatusChip';
import { VehicleDocumentTable } from './VehicleDocumentTable';
import { useAuthStore } from '../../store/authStore';
import type { VehicleDocumentResponse } from '../../types/fleet';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vehicleId = Number(id);

  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  const canModify = userRole === 'ADMIN' || userRole === 'FLEET_MANAGER';

  // State
  const [docOpen, setDocOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VehicleDocumentResponse | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | undefined>(undefined);

  // Form Fields State
  const [docName, setDocName] = useState('INSURANCE');
  const [docNumber, setDocNumber] = useState('');
  const [docExpiry, setDocExpiry] = useState('');
  const [docPath, setDocPath] = useState('');

  // Queries
  const { data: vehicle, isLoading: vehicleLoading, isError: vehicleError } = useVehicle(vehicleId);
  const { data: documents = [], isLoading: docsLoading } = useVehicleDocuments(vehicleId);

  // Mutations
  const uploadMutation = useUploadDocument(vehicleId);
  const updateMutation = useUpdateDocument(vehicleId, editingDoc?.id || 0);
  const deleteMutation = useDeleteDocument(vehicleId);

  // Handlers
  const handleOpenUpload = () => {
    setEditingDoc(undefined);
    setDocName('INSURANCE');
    setDocNumber('');
    setDocExpiry('');
    setDocPath('');
    setDocOpen(true);
  };

  const handleOpenEdit = (doc: VehicleDocumentResponse) => {
    setEditingDoc(doc);
    setDocName(doc.name);
    setDocNumber(doc.documentNumber);
    setDocExpiry(doc.expiryDate);
    setDocPath(doc.filePath);
    setDocOpen(true);
  };

  const handleOpenDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docNumber || !docExpiry || !docPath) {
      setToast('Please fill out all document fields.');
      return;
    }

    const payload = {
      name: docName,
      documentNumber: docNumber,
      expiryDate: docExpiry,
      filePath: docPath
    };

    const mutation = editingDoc
      ? updateMutation.mutateAsync(payload)
      : uploadMutation.mutateAsync(payload);

    mutation
      .then(() => {
        setDocOpen(false);
        setToast(`Document successfully ${editingDoc ? 'updated' : 'uploaded'}.`);
      })
      .catch((err) => {
        setToast(err.response?.data?.message || 'Failed to save document.');
      });
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutateAsync(deletingId)
        .then(() => {
          setDeleteOpen(false);
          setDeletingId(null);
          setToast('Document successfully deleted.');
        })
        .catch((err) => {
          setDeleteOpen(false);
          setToast(err.response?.data?.message || 'Failed to delete document.');
        });
    }
  };

  if (vehicleLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (vehicleError || !vehicle) {
    return (
      <Alert severity="error" action={<Button color="inherit" onClick={() => navigate('/vehicles')}>Back</Button>}>
        Vehicle not found or an error occurred.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/vehicles" underline="hover" color="inherit">
          Vehicles
        </Link>
        <Typography color="text.primary">{vehicle.registrationNumber}</Typography>
      </Breadcrumbs>

      {/* Title block */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vehicles')} variant="outlined">
          Back
        </Button>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Vehicle Details: {vehicle.registrationNumber}
          </Typography>
        </Box>
        <VehicleStatusChip status={vehicle.status} />
      </Stack>

      <Grid container spacing={3}>
        {/* Specifications */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Vehicle Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarTodayIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Vehicle Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {vehicle.vehicleType?.description ?? vehicle.vehicleType?.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SpeedIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Odometer Readings
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {vehicle.odometer.toLocaleString()} km
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SettingsIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Payload Capacity
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {vehicle.capacity} metric tons
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalAtmIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Acquisition Value
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      ${vehicle.acquisitionCost.toLocaleString()} USD
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Compliance Documents
                </Typography>
                {canModify && (
                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    size="small"
                    onClick={handleOpenUpload}
                  >
                    Upload Document
                  </Button>
                )}
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {docsLoading ? (
                <CircularProgress />
              ) : (
                <VehicleDocumentTable
                  documents={documents}
                  onDelete={handleOpenDelete}
                  onEdit={handleOpenEdit}
                  canModify={canModify}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload/Edit Document Dialog */}
      <Dialog open={docOpen} onClose={() => setDocOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingDoc ? 'Replace Document File' : 'Upload Compliance Document'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleDocSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              select
              required
              fullWidth
              label="Document Type"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            >
              <MenuItem value="INSURANCE">Insurance Certificate</MenuItem>
              <MenuItem value="REGISTRATION">Registration Certificate</MenuItem>
              <MenuItem value="POLLUTION">Pollution Certificate</MenuItem>
              <MenuItem value="PERMIT">Permit License</MenuItem>
              <MenuItem value="OTHER">Other compliance</MenuItem>
            </TextField>

            <TextField
              required
              fullWidth
              label="Document Reference Number"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
            />

            <TextField
              required
              fullWidth
              type="date"
              label="Expiry Date"
              InputLabelProps={{ shrink: true }}
              value={docExpiry}
              onChange={(e) => setDocExpiry(e.target.value)}
            />

            <TextField
              required
              fullWidth
              label="Local Storage / PDF Link"
              placeholder="/uploads/file.pdf"
              value={docPath}
              onChange={(e) => setDocPath(e.target.value)}
            />

            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setDocOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={uploadMutation.isPending || updateMutation.isPending}>
                Save Document
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Document Confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this compliance document? Expired or missing documents can affect fleet compliance health.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(undefined)} message={toast} />
    </Box>
  );
};
export default VehicleDetailPage;
