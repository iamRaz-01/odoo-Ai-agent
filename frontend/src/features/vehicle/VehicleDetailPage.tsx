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
  DialogContentText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import {
  useVehicle,
  useVehicleDocuments,
  useUploadDocument,
  useUpdateDocument,
  useDeleteDocument,
  useVehicleReadiness,
  useVehicleTelemetry,
  useScheduleMaintenance,
  useCloseMaintenance
} from './vehicleHooks';
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

  // Dialog & Toast State
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
  const { data: readiness, isLoading: readinessLoading } = useVehicleReadiness(vehicleId);
  const { data: telemetry, isLoading: telemetryLoading } = useVehicleTelemetry(vehicleId);

  // Mutations
  const uploadMutation = useUploadDocument(vehicleId);
  const updateMutation = useUpdateDocument(vehicleId, editingDoc?.id || 0);
  const deleteMutation = useDeleteDocument(vehicleId);
  const scheduleMaintMutation = useScheduleMaintenance(vehicleId);
  const closeMaintMutation = useCloseMaintenance(vehicleId);

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

  const handleScheduleMaintenance = () => {
    scheduleMaintMutation.mutateAsync()
      .then(() => {
        setToast('Vehicle scheduled for maintenance successfully.');
      })
      .catch((err) => {
        setToast(err.response?.data?.message || 'Failed to schedule maintenance.');
      });
  };

  const handleCloseMaintenance = () => {
    closeMaintMutation.mutateAsync()
      .then(() => {
        setToast('Vehicle maintenance completed and closed.');
      })
      .catch((err) => {
        setToast(err.response?.data?.message || 'Failed to close maintenance.');
      });
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
      <Alert severity="error" action={<Button color="inherit" onClick={() => navigate('/fleet/vehicles')}>Back</Button>}>
        Vehicle not found or an error occurred.
      </Alert>
    );
  }

  const isUnderMaintenance = vehicle.status === 'MAINTENANCE' || vehicle.status === 'IN_SHOP';

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/fleet/vehicles" underline="hover" color="inherit">
          Vehicles
        </Link>
        <Typography color="text.primary">{vehicle.registrationNumber}</Typography>
      </Breadcrumbs>

      {/* Title block */}
      <Stack direction={{ xs: 'column', md: 'row' }} justify-content="space-between" spacing={2} alignItems={{ md: 'center' }} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/fleet/vehicles')} variant="outlined">
            Back
          </Button>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Vehicle: {vehicle.registrationNumber}
            </Typography>
            {vehicle.name && (
              <Typography variant="subtitle1" color="text.secondary">
                {vehicle.name} {vehicle.model ? `(${vehicle.model})` : ''}
              </Typography>
            )}
          </Box>
          <VehicleStatusChip status={vehicle.status} />
        </Stack>

        {canModify && (
          <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
            {isUnderMaintenance ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={handleCloseMaintenance}
                disabled={closeMaintMutation.isPending}
              >
                Close Maintenance
              </Button>
            ) : (
              <Button
                variant="contained"
                color="warning"
                startIcon={<BuildIcon />}
                onClick={handleScheduleMaintenance}
                disabled={scheduleMaintMutation.isPending}
              >
                Schedule Maintenance
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      <Grid container spacing={3}>
        {/* Specifications */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Vehicle Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {vehicle.vehicleType?.description ?? vehicle.vehicleType?.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Fuel Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {vehicle.fuelType || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Manufacturing Year
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {vehicle.manufacturingYear || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Engine & Chassis Numbers
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    E: {vehicle.engineNumber || 'N/A'}<br />
                    C: {vehicle.chassisNumber || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Assigned Depot
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {vehicle.assignedDepot || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Odometer / Distance
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {vehicle.odometer.toLocaleString()} km
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Max Payload / Capacity
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {vehicle.maximumCapacity ? `${vehicle.maximumCapacity} tons` : `${vehicle.capacity} tons (base)`}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Dispatch Readiness check */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Dispatch Readiness Check
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {readinessLoading ? (
                <CircularProgress />
              ) : readiness ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    {readiness.ready ? (
                      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 36 }} />
                    ) : (
                      <ErrorOutlineIcon color="error" sx={{ fontSize: 36 }} />
                    )}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Status: {readiness.ready ? 'READY FOR DISPATCH' : 'NOT READY'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Verifies vehicle safety, fuel level and documentation compliance.
                      </Typography>
                    </Box>
                  </Box>

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        {readiness.insuranceValid ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Insurance Validation" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {readiness.fitnessValid ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Fitness Certificate" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {readiness.pollutionValid ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Pollution Certificate" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {readiness.fuelAvailable ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Fuel Available (>15%)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {readiness.driverAssigned ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Driver Assigned" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {readiness.maintenanceCompleted ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Maintenance Complete" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {readiness.noActiveBreakdown ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="No Active Breakdown" />
                    </ListItem>
                  </List>

                  {readiness.issues.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Discrepancies found:
                      </Typography>
                      {readiness.issues.map((issue, idx) => (
                        <Typography key={idx} variant="body2" color="error" sx={{ display: 'block', pl: 1 }}>
                          • {issue}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary">No readiness data available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Telemetry Health Display */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Vehicle Diagnostics (Telemetry)
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {telemetryLoading ? (
                <CircularProgress />
              ) : telemetry ? (
                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ThermostatIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Engine Temperature
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {telemetry.engineTemperature != null ? `${telemetry.engineTemperature}°C` : 'N/A (No active telemetry stream)'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BatteryChargingFullIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Battery Status
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {telemetry.batteryVoltage != null ? `${telemetry.batteryVoltage} V` : 'N/A (No active telemetry stream)'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalGasStationIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Fuel Telemetry
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {telemetry.fuelLevel != null ? `${telemetry.fuelLevel}%` : 'N/A (No active telemetry stream)'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TireRepairIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Tire Pressure
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {telemetry.tirePressure != null ? `${telemetry.tirePressure} psi` : 'N/A (No active telemetry stream)'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EngineeringIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Fault Codes / Warnings
                      </Typography>
                      {telemetry.engineFaultCodes.length > 0 ? (
                        telemetry.engineFaultCodes.map((code) => (
                          <Typography key={code} variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                            {code}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                          No DTC fault codes detected.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Stack>
              ) : (
                <Typography color="text.secondary">No diagnostic telemetry available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid size={{ xs: 12 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Compliance & Regulatory Documents
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
              <MenuItem value="ROAD_TAX">Road Tax License</MenuItem>
              <MenuItem value="PERMIT">Permit License</MenuItem>
              <MenuItem value="FITNESS">Fitness Certificate</MenuItem>
              <MenuItem value="SERVICE_RECORD">Service Record</MenuItem>
              <MenuItem value="OTHER">Other Compliance Document</MenuItem>
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
            Are you sure you want to delete this compliance document? Expired or missing documents will affect fleet compliance health.
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
