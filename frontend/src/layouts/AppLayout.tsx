import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  ListSubheader
} from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/Group';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RouteIcon from '@mui/icons-material/AltRoute';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { useAuthStore } from '../store/authStore';
import { authApi } from '../features/authentication/authApi';

const drawerWidth = 240;

type MenuItemType = 
  | { subheader: string }
  | { label: string; path: string; icon: React.ReactNode };

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clearSession);

  // Profile Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clear();
      navigate('/login', { replace: true });
    }
  });

  const userRole = user?.role?.name;

  // Active path checking helper
  const isActive = (path: string) => location.pathname === path;

  // Initial for avatar bubble
  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  // Define role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'FLEET_MANAGER': return 'primary';
      case 'DISPATCHER': return 'info';
      case 'SAFETY_OFFICER': return 'warning';
      case 'FINANCE_OFFICER': return 'secondary';
      default: return 'default';
    }
  };

  const getMenuItems = (): MenuItemType[] => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { subheader: 'System Administration' },
          { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
          { label: 'User Management', path: '/admin/users', icon: <PeopleIcon /> },
          { label: 'Role Permissions', path: '/admin/roles', icon: <SecurityIcon /> },
          { label: 'System Settings', path: '/admin/settings', icon: <SettingsIcon /> },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: <HistoryIcon /> },
          { subheader: 'Fleet Administration' },
          { label: 'Vehicles Registry', path: '/fleet/vehicles', icon: <DirectionsCarIcon /> },
          { label: 'Drivers Registry', path: '/safety/drivers', icon: <GroupIcon /> },
          { label: 'Trips Registry', path: '/trips', icon: <LocalShippingIcon /> }
        ];
      case 'FLEET_MANAGER':
        return [
          { subheader: 'Fleet Operations' },
          { label: 'Fleet Dashboard', path: '/fleet/dashboard', icon: <DashboardIcon /> },
          { label: 'Vehicles Registry', path: '/fleet/vehicles', icon: <DirectionsCarIcon /> },
          { label: 'Trips Registry', path: '/trips', icon: <LocalShippingIcon /> },
          { label: 'Fleet Analytics', path: '/fleet/analytics', icon: <AnalyticsIcon /> },
          { label: 'Fleet Alerts', path: '/fleet/alerts', icon: <ReportProblemIcon /> }
        ];
      case 'DISPATCHER':
        return [
          { subheader: 'Dispatch Panel' },
          { label: 'Dispatch Dashboard', path: '/dispatcher/dashboard', icon: <DashboardIcon /> },
          { label: 'Trips Registry', path: '/trips', icon: <LocalShippingIcon /> },
          { label: 'Trip Scheduling', path: '/dispatcher/scheduling', icon: <EventNoteIcon /> },
          { label: 'Assignments', path: '/dispatcher/assignments', icon: <RouteIcon /> }
        ];
      case 'DRIVER':
        return [
          { subheader: 'Driver Portal' },
          { label: 'Driver Dashboard', path: '/driver/dashboard', icon: <DashboardIcon /> },
          { label: 'My Assigned Trips', path: '/trips', icon: <RouteIcon /> },
          { label: 'Pre-Trip Inspection', path: '/driver/inspection', icon: <BuildIcon /> },
          { label: 'Fuel Logs', path: '/driver/fuel-logs', icon: <LocalGasStationIcon /> },
          { label: 'Expenses Claims', path: '/driver/expenses', icon: <AttachMoneyIcon /> }
        ];
      case 'SAFETY_OFFICER':
        return [
          { subheader: 'Safety & Compliance' },
          { label: 'Safety Dashboard', path: '/safety/dashboard', icon: <DashboardIcon /> },
          { label: 'Drivers Registry', path: '/safety/drivers', icon: <GroupIcon /> },
          { label: 'Compliance Audits', path: '/safety/compliance', icon: <HealthAndSafetyIcon /> },
          { label: 'Incident Records', path: '/safety/incidents', icon: <WarningAmberIcon /> },
          { label: 'Safety Training', path: '/safety/training', icon: <SchoolIcon /> }
        ];
      case 'FINANCE_OFFICER':
        return [
          { subheader: 'Finance & Accounts' },
          { label: 'Finance Dashboard', path: '/finance/dashboard', icon: <DashboardIcon /> },
          { label: 'Expenses Claims', path: '/finance/expenses', icon: <AttachMoneyIcon /> },
          { label: 'Fuel log receipts', path: '/finance/fuel-logs', icon: <LocalGasStationIcon /> },
          { label: 'Financial reports', path: '/finance/reports', icon: <AssessmentIcon /> }
        ];
      default:
        return [];
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', tracking: '0.5px' }}>
            TransitOps
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {user?.firstName} {user?.lastName}
            </Typography>

            <IconButton
              onClick={handleMenuClick}
              size="small"
              aria-controls={openMenu ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? 'true' : undefined}
              sx={{ p: 0.5 }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: '1rem', fontWeight: 'bold' }}>
                {initial}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              id="profile-menu"
              open={openMenu}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  minWidth: 200,
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {user?.email}
                </Typography>
                {userRole && (
                  <Chip
                    label={userRole.replace('_', ' ')}
                    color={getRoleColor(userRole)}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Box>
              <Divider />
              <MenuItem onClick={() => logout.mutate()} disabled={logout.isPending}>
                <ListItemIcon>
                  <PersonOutlineIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <List>
            {getMenuItems().map((item, index) => {
              if ('subheader' in item) {
                return (
                  <ListSubheader key={index} component="div" sx={{ lineHeight: '36px', fontWeight: 'bold' }}>
                    {item.subheader}
                  </ListSubheader>
                );
              }
              return (
                <ListItemButton
                  key={index}
                  component={RouterLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{ mb: 0.5 }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
          
          <Box>
            <Divider />
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                TRANSITOPS SYSTEM
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Version 1.0.0
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, pt: { xs: 10, md: 12 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
export default AppLayout;
