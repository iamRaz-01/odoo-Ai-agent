import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './AppLayout';
import { useAuthStore } from '../store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

describe('AppLayout Sidebar Rendering', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('renders Admin menu options and hides other dashboards for ADMIN role', () => {
    useAuthStore.setState({
      accessToken: 'dummy-token',
      user: {
        id: 1,
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@example.com',
        active: true,
        createdAt: '',
        updatedAt: '',
        role: { id: 1, name: 'ADMIN', description: '', createdAt: '', updatedAt: '' }
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppLayout />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verify Admin specific menu options
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Role Permissions')).toBeInTheDocument();

    // Verify Fleet Manager or Dispatcher specific labels are not present as primary sidebar links
    expect(screen.queryByText('Fleet Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Dispatch Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Driver Dashboard')).not.toBeInTheDocument();
  });

  it('renders Driver menu options and hides Admin options for DRIVER role', () => {
    useAuthStore.setState({
      accessToken: 'dummy-token',
      user: {
        id: 2,
        firstName: 'Truck',
        lastName: 'Driver',
        email: 'driver@example.com',
        active: true,
        createdAt: '',
        updatedAt: '',
        role: { id: 2, name: 'DRIVER', description: '', createdAt: '', updatedAt: '' }
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppLayout />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verify Driver specific options
    expect(screen.getByText('Driver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Assigned Trips')).toBeInTheDocument();
    expect(screen.getByText('Pre-Trip Inspection')).toBeInTheDocument();

    // Verify Admin items are hidden
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('User Management')).not.toBeInTheDocument();
  });
});
