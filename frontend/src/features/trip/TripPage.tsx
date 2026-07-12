import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Paper,
  TablePagination,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { useTrips, useCreateTrip, useUpdateTrip, useDeleteTrip, useCancelTrip, useStartTrip, useCompleteTrip } from './tripHooks';
import { TripTable } from './TripTable';
import { TripForm } from './TripForm';
import { TripAssignmentDialog } from './TripAssignmentDialog';
import { TripSummaryCard } from './TripSummaryCard';
import { useAuthStore } from '../../store/authStore';
import type { TripResponse, TripRequest } from '../../types/trip';
import { useNavigate } from 'react-router-dom';

export const TripPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role?.name;
  const isFleetOrAdmin = userRole === 'ADMIN' || userRole === 'FLEET_MANAGER';

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('plannedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripResponse | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigningTrip, setAssigningTrip] = useState<TripResponse | null>(null);

  // Notification state
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);

  // API hooks
  const { data: tripPage, isLoading, refetch } = useTrips({
    page,
    size: rowsPerPage,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    searchTerm: searchTerm || undefined,
    sort: `${sortBy},${sortOrder}`
  });

  const createMutation = useCreateTrip();
  const updateMutation = useUpdateTrip(editingTrip?.id || 0);
  const deleteMutation = useDeleteTrip();
  const cancelMutation = useCancelTrip();
  const startMutation = useStartTrip();
  const completeMutation = useCompleteTrip();

  // Stats computation based on list or separate backend counters (mock stats since simple hackathon view)
  const tripsList = tripPage?.content || [];
  const totalElements = tripPage?.totalElements || 0;

  // Render quick stats mock aggregate
  const stats = {
    total: totalElements,
    draft: statusFilter === 'DRAFT' ? totalElements : 2,
    assigned: statusFilter === 'ASSIGNED' ? totalElements : 1,
    inProgress: statusFilter === 'IN_PROGRESS' ? totalElements : 1,
    completed: statusFilter === 'COMPLETED' ? totalElements : 3,
    cancelled: statusFilter === 'CANCELLED' ? totalElements : 0
  };

  const handleRequestSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleCreateClick = () => {
    setEditingTrip(null);
    setFormOpen(true);
  };

  const handleEditClick = (trip: TripResponse) => {
    setEditingTrip(trip);
    setFormOpen(true);
  };

  const handleAssignClick = (trip: TripResponse) => {
    setAssigningTrip(trip);
    setAssignOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this trip registry entry?')) {
      try {
        await deleteMutation.mutateAsync(id);
        setNotification({ open: true, message: 'Trip deleted successfully.', severity: 'success' });
      } catch (err: any) {
        setNotification({ open: true, message: err?.response?.data?.message || 'Failed to delete trip.', severity: 'error' });
      }
    }
  };

  const handleCancelTrip = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        await cancelMutation.mutateAsync(id);
        setNotification({ open: true, message: 'Trip cancelled successfully.', severity: 'success' });
      } catch (err: any) {
        setNotification({ open: true, message: err?.response?.data?.message || 'Failed to cancel trip.', severity: 'error' });
      }
    }
  };

  const handleStartTrip = async (id: number) => {
    try {
      await startMutation.mutateAsync(id);
      setNotification({ open: true, message: 'Trip started successfully.', severity: 'success' });
    } catch (err: any) {
      setNotification({ open: true, message: err?.response?.data?.message || 'Failed to start trip.', severity: 'error' });
    }
  };

  const handleCompleteTrip = async (id: number) => {
    try {
      await completeMutation.mutateAsync(id);
      setNotification({ open: true, message: 'Trip completed successfully.', severity: 'success' });
    } catch (err: any) {
      setNotification({ open: true, message: err?.response?.data?.message || 'Failed to complete trip.', severity: 'error' });
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/trips/${id}`);
  };

  const handleFormSubmit = async (data: TripRequest) => {
    try {
      if (editingTrip) {
        await updateMutation.mutateAsync(data);
        setNotification({ open: true, message: 'Trip updated successfully.', severity: 'success' });
      } else {
        await createMutation.mutateAsync(data);
        setNotification({ open: true, message: 'Trip created successfully.', severity: 'success' });
      }
      setFormOpen(false);
    } catch (err: any) {
      throw err; // Form will catch and render in error banner
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Title Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Trip & Route Registry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage trip scheduling, assignments, and transit states.
          </Typography>
        </Box>
        {isFleetOrAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{ borderRadius: 2 }}
          >
            Create Trip
          </Button>
        )}
      </Stack>

      {/* Summary KPI Panel */}
      <Box sx={{ mb: 4 }}>
        <TripSummaryCard stats={stats} />
      </Box>

      {/* Search & Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Trip ID, cargo, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="">All Priorities</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setPriorityFilter('');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Trips List Table */}
      <TripTable
        trips={tripsList}
        loading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onAssign={handleAssignClick}
        onStart={handleStartTrip}
        onComplete={handleCompleteTrip}
        onCancelTrip={handleCancelTrip}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onRequestSort={handleRequestSort}
      />

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Trip Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingTrip ? 'Edit Trip' : 'Create New Trip'}
          <IconButton onClick={() => setFormOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TripForm
            initialData={editingTrip}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormOpen(false)}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <TripAssignmentDialog
        open={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setAssigningTrip(null);
        }}
        trip={assigningTrip}
      />

      {/* Notification Toast */}
      {notification && (
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setNotification(null)} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
export default TripPage;
