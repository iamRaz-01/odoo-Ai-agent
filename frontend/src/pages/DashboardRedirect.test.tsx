import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DashboardRedirect } from './DashboardRedirect';
import { useAuthStore } from '../store/authStore';

describe('DashboardRedirect', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const testRedirectForRole = (roleName: string, expectedPath: string) => {
    useAuthStore.setState({
      accessToken: 'dummy-token',
      user: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        active: true,
        createdAt: '',
        updatedAt: '',
        role: { id: 1, name: roleName, description: '', createdAt: '', updatedAt: '' }
      }
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path={expectedPath} element={<div>Target Path: {expectedPath}</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(`Target Path: ${expectedPath}`)).toBeInTheDocument();
  };

  it('redirects ADMIN to /admin/dashboard', () => {
    testRedirectForRole('ADMIN', '/admin/dashboard');
  });

  it('redirects FLEET_MANAGER to /fleet/dashboard', () => {
    testRedirectForRole('FLEET_MANAGER', '/fleet/dashboard');
  });

  it('redirects DRIVER to /driver/dashboard', () => {
    testRedirectForRole('DRIVER', '/driver/dashboard');
  });

  it('redirects DISPATCHER to /dispatcher/dashboard', () => {
    testRedirectForRole('DISPATCHER', '/dispatcher/dashboard');
  });

  it('redirects SAFETY_OFFICER to /safety/dashboard', () => {
    testRedirectForRole('SAFETY_OFFICER', '/safety/dashboard');
  });

  it('redirects FINANCE_OFFICER to /finance/dashboard', () => {
    testRedirectForRole('FINANCE_OFFICER', '/finance/dashboard');
  });
});
