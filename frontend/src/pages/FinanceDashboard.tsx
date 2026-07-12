import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';

export function FinanceDashboard() {
  const navigate = useNavigate();

  // Mock Expenses
  const recentTransactions = [
    { id: 1, desc: 'Fuel Refuel - Kenworth REG-9910', amount: '$245.00', date: 'Today', status: 'PAID', type: 'FUEL' },
    { id: 2, desc: 'Alternator replacement invoice #4820', amount: '$450.00', date: 'Yesterday', status: 'PENDING', type: 'MAINTENANCE' },
    { id: 3, desc: 'Toll gate reimbursement - John Doe', amount: '$35.20', date: '2 days ago', status: 'APPROVED', type: 'EXPENSE' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Finance Operations Ledger
        </Typography>
        <Typography color="text.secondary">
          Monitor operating expenses, verify fuel log invoices, and audit driver reimbursement claims.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Total Spend (MTD)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    $12,480
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
                  <PaidIcon />
                </Avatar>
              </Stack>
              <Chip label="Within Budget" color="success" size="small" variant="outlined" sx={{ mt: 1.5, fontWeight: 'bold' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Fuel Logs Costs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    $4,210
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                  <LocalGasStationIcon />
                </Avatar>
              </Stack>
              <Chip label="Fuel Receipts" size="small" onClick={() => navigate('/fuel-logs')} sx={{ mt: 1.5, cursor: 'pointer' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Pending Invoices
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    4
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                  <ReceiptLongIcon />
                </Avatar>
              </Stack>
              <Chip label="Audit Required" color="warning" size="small" variant="outlined" sx={{ mt: 1.5, fontWeight: 'bold' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                    Remaining Budget
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    $37,520
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                  <AccountBalanceWalletIcon />
                </Avatar>
              </Stack>
              <Chip label="Healthy Buffer" color="success" size="small" variant="outlined" sx={{ mt: 1.5, fontWeight: 'bold' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Ledger logs */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Operating Claims & Invoices
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                {recentTransactions.map((tx) => (
                  <ListItem key={tx.id} disableGutters divider>
                    <ListItemIcon>
                      <PaidIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={tx.desc}
                      secondary={`${tx.date} • Type: ${tx.type}`}
                    />
                    <Stack alignItems="flex-end" spacing={0.5}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {tx.amount}
                      </Typography>
                      <Chip
                        label={tx.status}
                        color={tx.status === 'PAID' || tx.status === 'APPROVED' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 18, fontWeight: 'bold' }}
                      />
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Finance Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Reimbursements & Claims
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReceiptLongIcon />}
                  onClick={() => navigate('/expenses')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Manage Expense Claims
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LocalGasStationIcon />}
                  onClick={() => navigate('/fuel-logs')}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Verify Fuel Receipts
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AssessmentIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.2 }}
                >
                  Export Financial Report
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FinanceDashboard;
