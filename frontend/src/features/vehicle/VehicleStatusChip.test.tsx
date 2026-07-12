import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VehicleStatusChip } from './VehicleStatusChip';

describe('VehicleStatusChip', () => {
  it('renders AVAILABLE status correctly', () => {
    render(<VehicleStatusChip status="AVAILABLE" />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders ON_TRIP status correctly', () => {
    render(<VehicleStatusChip status="ON_TRIP" />);
    expect(screen.getByText('On Trip')).toBeInTheDocument();
  });

  it('renders BREAKDOWN status correctly', () => {
    render(<VehicleStatusChip status="BREAKDOWN" />);
    expect(screen.getByText('Breakdown')).toBeInTheDocument();
  });
});
