import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DriverTable } from './DriverTable';
import { useAuthStore } from '../../store/authStore';
import type { DriverResponse } from '../../types/driver';

const mockDrivers: DriverResponse[] = [
  {
    id: 1,
    fullName: 'John Doe',
    licenseNumber: 'LIC-1111',
    licenseCategory: 'CLASS-A',
    licenseExpiry: '2030-01-01',
    phoneNumber: '+111222333',
    email: 'john@example.com',
    safetyScore: 95,
    status: 'AVAILABLE'
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    licenseNumber: 'LIC-2222',
    licenseCategory: 'CLASS-B',
    licenseExpiry: '2031-01-01',
    phoneNumber: '+444555666',
    email: 'jane@example.com',
    safetyScore: 90,
    status: 'SUSPENDED'
  }
];

describe('DriverTable', () => {
  const mockEdit = vi.fn();
  const mockDelete = vi.fn();
  const mockView = vi.fn();
  const mockActivate = vi.fn();
  const mockSuspend = vi.fn();
  const mockSort = vi.fn();

  it('renders all table headers and lists driver entries', () => {
    // Set role to viewer (e.g. Dispatcher)
    useAuthStore.setState({ user: { id: 2, firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com', active: true, createdAt: '', updatedAt: '', role: { id: 3, name: 'DISPATCHER', description: 'Dispatcher', createdAt: '', updatedAt: '' } } });

    render(
      <DriverTable
        drivers={mockDrivers}
        loading={false}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onViewDetails={mockView}
        onActivate={mockActivate}
        onSuspend={mockSuspend}
        sortBy="fullName"
        sortOrder="asc"
        onRequestSort={mockSort}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('LIC-1111')).toBeInTheDocument();

    // Verify modify action buttons are NOT rendered for Dispatcher
    expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('renders modifications and actions for admin role', () => {
    // Set role to ADMIN
    useAuthStore.setState({ user: { id: 1, firstName: 'Alice', lastName: 'Wonder', email: 'alice@example.com', active: true, createdAt: '', updatedAt: '', role: { id: 1, name: 'ADMIN', description: 'Administrator', createdAt: '', updatedAt: '' } } });

    render(
      <DriverTable
        drivers={mockDrivers}
        loading={false}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onViewDetails={mockView}
        onActivate={mockActivate}
        onSuspend={mockSuspend}
        sortBy="fullName"
        sortOrder="asc"
        onRequestSort={mockSort}
      />
    );

    // Verify modify action buttons (tooltips are present, we can check by button aria label or tooltip title)
    expect(screen.getAllByRole('button').length).toBeGreaterThan(2);
  });
});
