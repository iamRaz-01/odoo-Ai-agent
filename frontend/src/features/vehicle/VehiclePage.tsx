import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
  Stack,
  Alert,
  TablePagination,
  DialogContentText,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { VehicleTable } from './VehicleTable';
import { VehicleForm, VehicleFormValues } from './VehicleForm';
import { VehicleFilterPanel } from './VehicleFilterPanel';
import {
  useVehicles,
  useVehicleTypes,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle
} from './vehicleHooks';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import type { VehicleResponse } from '../../types/fleet';

export const VehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  const canModify = userRole === 'ADMIN' || userRole === 'FLEET_MANAGER';

  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [typeId, setTypeId] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('registrationNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Dialog & Toast States
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleResponse | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | undefined>(undefined);

  // Queries
  const { data: vehicleTypes = [] } = useVehicleTypes();
  const {
    data: vehiclesPage,
    isLoading,
    isError,
    error
  } = useVehicles({
    search: search || undefined,
    status: status || undefined,
    typeId: typeId || undefined,
    page,
    size: rowsPerPage,
    sort: `${sortBy},${sortOrder}`
  });

  // Mutations
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle(editingVehicle?.id || 0);
  const deleteMutation = useDeleteVehicle();

  // Handlers
  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortRequest = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
    setPage(0);
  };

  const handleOpenCreate = () => {
    setEditingVehicle(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (vehicle: VehicleResponse) => {
    setEditingVehicle(vehicle);
    setFormOpen(true);
  };

  const handleOpenDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (values: VehicleFormValues) => {
    const mutation = editingVehicle
      ? updateMutation.mutateAsync(values)
      : createMutation.mutateAsync(values);

    mutation
      .then(() => {
        setFormOpen(false);
        setEditingVehicle(undefined);
        setToastMessage(`Vehicle successfully ${editingVehicle ? 'updated' : 'registered'}.`);
      })
      .catch((err) => {
        setToastMessage(err.response?.data?.message || 'An error occurred while saving the vehicle.');
      });
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutateAsync(deletingId)
        .then(() => {
          setDeleteOpen(false);
          setDeletingId(null);
          setToastMessage('Vehicle successfully deleted.');
        })
        .catch((err) => {
          setDeleteOpen(false);
          setToastMessage(err.response?.data?.message || 'An error occurred while deleting the vehicle.');
        });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setTypeId(0);
    setPage(0);
  };

  const errorMessage = (err: any) => {
    return err?.response?.data?.message || err?.message || 'Unable to fetch vehicles.';
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Vehicles
          </Typography>
          <Typography color="text.secondary">
            Manage your organization's transport fleet and assets.
          </Typography>
        </Box>
        {canModify && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleOpenCreate}
            sx={{ height: 40 }}
          >
            Register Vehicle
          </Button>
        )}
      </Stack>

      <VehicleFilterPanel
        search={search}
        status={status}
        typeId={typeId}
        vehicleTypes={vehicleTypes}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        onStatusChange={(val) => { setStatus(val); setPage(0); }}
        onTypeChange={(val) => { setTypeId(val); setPage(0); }}
        onReset={handleResetFilters}
      />

      {isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage(error)}
        </Alert>
      ) : (
        <>
          <VehicleTable
            vehicles={vehiclesPage?.content ?? []}
            loading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onViewDetails={(id) => navigate(`/vehicles/${id}`)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onRequestSort={handleSortRequest}
          />

          {vehiclesPage && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={vehiclesPage.totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </>
      )}

      {/* Create / Edit Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}
        </DialogTitle>
        <DialogContent dividers>
          <VehicleForm
            onSubmit={handleFormSubmit}
            initialValues={editingVehicle}
            vehicleTypes={vehicleTypes}
            isEdit={!!editingVehicle}
            isPending={editingVehicle ? updateMutation.isPending : createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this vehicle? This action will mark the vehicle as deleted and remove it from active fleet operations.
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

      {/* Toast SnackBar Alert */}
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
        onClose={() => setToastMessage(undefined)}
        message={toastMessage}
      />
    </Box>
  );
};
export default VehiclePage;
