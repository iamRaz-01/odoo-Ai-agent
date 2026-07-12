import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { TripForm } from './TripForm';

vi.mock('../driver/driverHooks', () => ({
  useDriverSearch: () => ({ data: { content: [] } })
}));

vi.mock('../vehicle/vehicleHooks', () => ({
  useVehicles: () => ({ data: { content: [] } })
}));

describe('TripForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('validates required fields on empty submit', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();
    
    render(<TripForm onSubmit={handleSubmit} onCancel={handleCancel} />);

    fireEvent.click(screen.getByRole('button', { name: 'Create Trip' }));

    await waitFor(() => {
      expect(screen.getByText('Please fill out all required fields.')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('validates that cargo weight must be positive', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(<TripForm onSubmit={handleSubmit} onCancel={handleCancel} />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Trip Name/i), { target: { value: 'Test Cargo' } });
    fireEvent.change(screen.getByLabelText(/Source Location/i), { target: { value: 'Warehouse A' } });
    fireEvent.change(screen.getByLabelText(/Destination Location/i), { target: { value: 'Hub B' } });
    fireEvent.change(screen.getByLabelText(/Cargo Type/i), { target: { value: 'Steel' } });
    fireEvent.change(screen.getByLabelText(/Cargo Weight \(Tons\)/i), { target: { value: '-5.0' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Trip' }));

    await waitFor(() => {
      expect(screen.getByText('Cargo weight must be a positive number.')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
