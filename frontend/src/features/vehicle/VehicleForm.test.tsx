import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { VehicleForm } from './VehicleForm';

const mockTypes = [
  { id: 1, name: 'TRUCK', description: 'Heavy Truck' },
  { id: 2, name: 'VAN', description: 'Cargo Van' }
];

describe('VehicleForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('validates required fields on empty submit', async () => {
    const handleSubmit = vi.fn();
    render(<VehicleForm onSubmit={handleSubmit} vehicleTypes={mockTypes} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Registration number must be at least 3 characters.')).toBeInTheDocument();
      expect(screen.getByText('Vehicle type is required.')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('validates that capacity must be positive', async () => {
    const handleSubmit = vi.fn();
    render(<VehicleForm onSubmit={handleSubmit} vehicleTypes={mockTypes} />);

    fireEvent.change(screen.getByLabelText(/Registration Number/i), { target: { value: 'NY-5555' } });
    fireEvent.change(screen.getByLabelText(/Capacity/i), { target: { value: '-2.5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Capacity must be greater than zero.')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('validates that odometer cannot be negative', async () => {
    const handleSubmit = vi.fn();
    render(<VehicleForm onSubmit={handleSubmit} vehicleTypes={mockTypes} />);

    fireEvent.change(screen.getByLabelText(/Odometer/i), { target: { value: '-10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Odometer cannot be negative.')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
