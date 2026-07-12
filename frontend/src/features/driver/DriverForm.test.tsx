import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { DriverForm } from './DriverForm';
import type { DriverResponse } from '../../types/driver';

describe('DriverForm', () => {
  const mockSubmit = vi.fn();

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('validates required fields on empty submit', async () => {
    render(<DriverForm onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Full name must be at least 2 characters.')).toBeInTheDocument();
      expect(screen.getByText('License number is required.')).toBeInTheDocument();
      expect(screen.getByText('License category is required.')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates that license expiry must be in the future', async () => {
    render(<DriverForm onSubmit={mockSubmit} />);

    // Enter a past date for license expiry
    fireEvent.change(screen.getByLabelText(/License Expiry/i), { target: { value: '2020-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('License expiry date must be in the future.')).toBeInTheDocument();
    });
  });

  it('disables the license number input field in edit mode', () => {
    const initialDriver: DriverResponse = {
      id: 1,
      fullName: 'John Doe',
      licenseNumber: 'LIC-1234',
      licenseCategory: 'CLASS-A',
      licenseExpiry: '2030-05-15',
      phoneNumber: '+1234567890',
      email: 'john@example.com',
      safetyScore: 98,
      status: 'AVAILABLE'
    };

    render(
      <DriverForm
        onSubmit={mockSubmit}
        initialValues={initialDriver}
        isEdit={true}
      />
    );

    const licenseInput = screen.getByLabelText(/License Number/i) as HTMLInputElement;
    expect(licenseInput).toBeDisabled();
    expect(licenseInput.value).toBe('LIC-1234');
  });
});
