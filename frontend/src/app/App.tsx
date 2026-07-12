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
const DashboardPage = lazy(() => import('../pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const UsersPage = lazy(() => import('../features/users/UsersPage').then((module) => ({ default: module.UsersPage })));

// Milestone 2 - Fleet Management Views
const VehiclePage = lazy(() => import('../features/vehicle/VehiclePage').then((module) => ({ default: module.VehiclePage })));
const VehicleDetailPage = lazy(() => import('../features/vehicle/VehicleDetailPage').then((module) => ({ default: module.VehicleDetailPage })));
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
                  {/* Dashboard accessible to all staff except drivers */}
                  <Route element={<RoleRoute roles={['ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCE_OFFICER']} />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    {/* Fleet module routes */}
                    <Route path="/vehicles" element={<VehiclePage />} />
                    <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                    
                    {/* Placeholder routes for future milestones */}
                    <Route path="/drivers" element={<ComingSoonPage />} />
                    <Route path="/trips" element={<ComingSoonPage />} />
                    <Route path="/maintenance" element={<ComingSoonPage />} />
                    <Route path="/fuel-logs" element={<ComingSoonPage />} />
                    <Route path="/expenses" element={<ComingSoonPage />} />
                  </Route>

                  {/* Admin-only User Management */}
                  <Route element={<RoleRoute roles={['ADMIN']} />}>
                    <Route path="/users" element={<UsersPage />} />
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
