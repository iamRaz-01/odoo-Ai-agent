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
import { useNavigate } from 'react-router-dom';

import { DriverTable } from './DriverTable';
import { DriverForm, DriverFormValues } from './DriverForm';
import { DriverFilterPanel } from './DriverFilterPanel';
import { DriverSearchBar } from './DriverSearchBar';
import {
  useDriverSearch,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
  useActivateDriver,
  useSuspendDriver
} from './driverHooks';
import { useAuthStore } from '../../store/authStore';
import type { DriverResponse, DriverStatus } from '../../types/driver';

export const DriverPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  const canModify = userRole === 'ADMIN' || userRole === 'SAFETY_OFFICER';

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [minSafetyScore, setMinSafetyScore] = useState('');
  const [expiryBefore, setExpiryBefore] = useState('');
  const [expiryAfter, setExpiryAfter] = useState('');

  // Pagination & Sorting States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Dialog & Toast States
  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverResponse | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | undefined>(undefined);

  // Queries
  const {
    data: driversPage,
    isLoading,
    isError,
    error
  } = useDriverSearch({
    name: search || undefined,
    licenseNumber: search || undefined,
    status: (status as DriverStatus) || undefined,
    licenseCategory: category || undefined,
    minSafetyScore: minSafetyScore ? Number(minSafetyScore) : undefined,
    licenseExpiryBefore: expiryBefore || undefined,
    licenseExpiryAfter: expiryAfter || undefined,
    page,
    size: rowsPerPage,
    sort: `${sortBy},${sortOrder}`
  });

  // Mutations
  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver(editingDriver?.id || 0);
  const deleteMutation = useDeleteDriver();
  const activateMutation = useActivateDriver();
  const suspendMutation = useSuspendDriver();

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
    setEditingDriver(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (driver: DriverResponse) => {
    setEditingDriver(driver);
    setFormOpen(true);
  };

  const handleOpenDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (values: DriverFormValues) => {
    const mutation = editingDriver
      ? updateMutation.mutateAsync(values)
      : createMutation.mutateAsync(values);

    mutation
      .then(() => {
        setFormOpen(false);
        setEditingDriver(undefined);
        setToastMessage(`Driver record successfully ${editingDriver ? 'updated' : 'registered'}.`);
      })
      .catch((err) => {
        setToastMessage(err.response?.data?.message || 'An error occurred while saving the driver.');
      });
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutateAsync(deletingId)
        .then(() => {
          setDeleteOpen(false);
          setDeletingId(null);
          setToastMessage('Driver record successfully deleted.');
        })
        .catch((err) => {
          setDeleteOpen(false);
          setToastMessage(err.response?.data?.message || 'An error occurred while deleting the driver.');
        });
    }
  };

  const handleActivate = (id: number) => {
    activateMutation.mutateAsync(id)
      .then(() => setToastMessage('Driver successfully activated (Status: AVAILABLE).'))
      .catch((err) => setToastMessage(err.response?.data?.message || 'Failed to activate driver.'));
  };

  const handleSuspend = (id: number) => {
    suspendMutation.mutateAsync(id)
      .then(() => setToastMessage('Driver successfully suspended (Status: SUSPENDED).'))
      .catch((err) => setToastMessage(err.response?.data?.message || 'Failed to suspend driver.'));
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setMinSafetyScore('');
    setExpiryBefore('');
    setExpiryAfter('');
    setPage(0);
  };

  const errorMessage = (err: any) => {
    return err?.response?.data?.message || err?.message || 'Unable to fetch drivers.';
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Drivers Registry
          </Typography>
          <Typography color="text.secondary">
            Manage commercial drivers, license credentials, and safety performance records.
          </Typography>
        </Box>
        {canModify && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleOpenCreate}
            sx={{ height: 40 }}
          >
            Register Driver
          </Button>
        )}
      </Stack>

      <Box sx={{ mb: 2 }}>
        <DriverSearchBar value={search} onChange={(val) => { setSearch(val); setPage(0); }} />
      </Box>

      <DriverFilterPanel
        status={status}
        category={category}
        minSafetyScore={minSafetyScore}
        licenseExpiryBefore={expiryBefore}
        licenseExpiryAfter={expiryAfter}
        onStatusChange={(val) => { setStatus(val); setPage(0); }}
        onCategoryChange={(val) => { setCategory(val); setPage(0); }}
        onMinSafetyScoreChange={(val) => { setMinSafetyScore(val); setPage(0); }}
        onExpiryBeforeChange={(val) => { setExpiryBefore(val); setPage(0); }}
        onExpiryAfterChange={(val) => { setExpiryAfter(val); setPage(0); }}
        onReset={handleResetFilters}
      />

      {isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage(error)}
        </Alert>
      ) : (
        <>
          <DriverTable
            drivers={driversPage?.content ?? []}
            loading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onViewDetails={(id) => navigate(`/safety/drivers/${id}`)}
            onActivate={handleActivate}
            onSuspend={handleSuspend}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onRequestSort={handleSortRequest}
          />

          {driversPage && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={driversPage.totalElements}
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
          {editingDriver ? 'Edit Driver Profile' : 'Register New Driver'}
        </DialogTitle>
        <DialogContent dividers>
          <DriverForm
            onSubmit={handleFormSubmit}
            initialValues={editingDriver}
            isEdit={!!editingDriver}
            isPending={editingDriver ? updateMutation.isPending : createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Driver Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this driver? This action will mark the driver as deleted and deactivate their operations credentials.
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

      {/* Toast Alert */}
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
        onClose={() => setToastMessage(undefined)}
        message={toastMessage}
      />
    </Box>
  );
};
export default DriverPage;
