import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RoleRoute } from '../routes/RoleRoute';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

// Lazy loaded page components
const LoginPage = lazy(() => import('../features/authentication/LoginPage').then((module) => ({ default: module.LoginPage })));
const UsersPage = lazy(() => import('../features/users/UsersPage').then((module) => ({ default: module.UsersPage })));

// Dashboards
const DashboardRedirect = lazy(() => import('../pages/DashboardRedirect').then((module) => ({ default: module.DashboardRedirect })));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const FleetDashboard = lazy(() => import('../pages/FleetDashboard').then((module) => ({ default: module.FleetDashboard })));
const DispatcherDashboard = lazy(() => import('../pages/DispatcherDashboard').then((module) => ({ default: module.DispatcherDashboard })));
const DriverDashboard = lazy(() => import('../pages/DriverDashboard').then((module) => ({ default: module.DriverDashboard })));
const SafetyDashboard = lazy(() => import('../pages/SafetyDashboard').then((module) => ({ default: module.SafetyDashboard })));
const FinanceDashboard = lazy(() => import('../pages/FinanceDashboard').then((module) => ({ default: module.FinanceDashboard })));

// Core Views
const VehiclePage = lazy(() => import('../features/vehicle/VehiclePage').then((module) => ({ default: module.VehiclePage })));
const VehicleDetailPage = lazy(() => import('../features/vehicle/VehicleDetailPage').then((module) => ({ default: module.VehicleDetailPage })));
const DriverPage = lazy(() => import('../features/driver/DriverPage').then((module) => ({ default: module.DriverPage })));
const DriverDetailPage = lazy(() => import('../features/driver/DriverDetailPage').then((module) => ({ default: module.DriverDetailPage })));
const TripPage = lazy(() => import('../features/trip/TripPage').then((module) => ({ default: module.TripPage })));
const TripDetailPage = lazy(() => import('../features/trip/TripDetailPage').then((module) => ({ default: module.TripDetailPage })));
const ComingSoonPage = lazy(() => import('../pages/ComingSoonPage').then((module) => ({ default: module.ComingSoonPage })));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });
const theme = createTheme({ colorSchemes: { light: true, dark: true }, cssVariables: true });

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading…</div>}>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Workspace Layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  {/* Gateway Redirector */}
                  <Route path="/dashboard" element={<DashboardRedirect />} />

                  {/* ADMIN ONLY ROUTES */}
                  <Route element={<RoleRoute roles={['ADMIN']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UsersPage />} />
                    <Route path="/admin/roles" element={<ComingSoonPage />} />
                    <Route path="/admin/settings" element={<ComingSoonPage />} />
                    <Route path="/admin/audit-logs" element={<ComingSoonPage />} />
                  </Route>

                  {/* FLEET WORKSPACE ROUTES */}
                  <Route element={<RoleRoute roles={['ADMIN', 'FLEET_MANAGER']} />}>
                    <Route path="/fleet/dashboard" element={<FleetDashboard />} />
                    <Route path="/fleet/vehicles" element={<VehiclePage />} />
                    <Route path="/fleet/vehicles/:id" element={<VehicleDetailPage />} />
                    <Route path="/fleet/analytics" element={<ComingSoonPage />} />
                    <Route path="/fleet/alerts" element={<ComingSoonPage />} />
                  </Route>

                  {/* TRIP MANAGEMENT ROUTES */}
                  <Route element={<RoleRoute roles={['ADMIN', 'FLEET_MANAGER', 'DRIVER']} />}>
                    <Route path="/trips" element={<TripPage />} />
                    <Route path="/trips/:id" element={<TripDetailPage />} />
                  </Route>

                  {/* DISPATCHER WORKSPACE ROUTES */}
                  <Route element={<RoleRoute roles={['DISPATCHER']} />}>
                    <Route path="/dispatcher/dashboard" element={<DispatcherDashboard />} />
                    <Route path="/dispatcher/trips" element={<ComingSoonPage />} />
                    <Route path="/dispatcher/scheduling" element={<ComingSoonPage />} />
                    <Route path="/dispatcher/assignments" element={<ComingSoonPage />} />
                  </Route>

                  {/* DRIVER WORKSPACE ROUTES */}
                  <Route element={<RoleRoute roles={['DRIVER']} />}>
                    <Route path="/driver/dashboard" element={<DriverDashboard />} />
                    <Route path="/driver/trips" element={<ComingSoonPage />} />
                    <Route path="/driver/inspection" element={<ComingSoonPage />} />
                    <Route path="/driver/fuel-logs" element={<ComingSoonPage />} />
                    <Route path="/driver/expenses" element={<ComingSoonPage />} />
                  </Route>

                  {/* SAFETY WORKSPACE ROUTES */}
                  <Route element={<RoleRoute roles={['SAFETY_OFFICER']} />}>
                    <Route path="/safety/dashboard" element={<SafetyDashboard />} />
                    <Route path="/safety/compliance" element={<ComingSoonPage />} />
                    <Route path="/safety/incidents" element={<ComingSoonPage />} />
                    <Route path="/safety/verification" element={<ComingSoonPage />} />
                    <Route path="/safety/training" element={<ComingSoonPage />} />
                  </Route>
                  {/* Share drivers registry access with ADMIN */}
                  <Route element={<RoleRoute roles={['ADMIN', 'SAFETY_OFFICER']} />}>
                    <Route path="/safety/drivers" element={<DriverPage />} />
                    <Route path="/safety/drivers/:id" element={<DriverDetailPage />} />
                  </Route>

                  {/* FINANCE WORKSPACE ROUTES */}
                  <Route element={<RoleRoute roles={['FINANCE_OFFICER']} />}>
                    <Route path="/finance/dashboard" element={<FinanceDashboard />} />
                    <Route path="/finance/expenses" element={<ComingSoonPage />} />
                    <Route path="/finance/fuel-logs" element={<ComingSoonPage />} />
                    <Route path="/finance/reports" element={<ComingSoonPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Error routes */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
export default App;
