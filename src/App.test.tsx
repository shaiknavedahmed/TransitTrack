import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ROLE_ALLOWED_SCREENS } from './utils/roleConfig';

// Mock Leaflet and screens to keep unit tests fast and focused on access control
vi.mock('./screens/AdminDashboard', () => ({
  AdminDashboard: () => <div data-testid="admin-dashboard">Admin Master Console</div>,
}));

vi.mock('./screens/LiveMapScreen', () => ({
  LiveMapScreen: () => <div data-testid="live-map-screen">Live Transit Map</div>,
}));

vi.mock('./screens/OperatorScreen', () => ({
  OperatorScreen: () => <div data-testid="operator-screen">Operator Dispatch</div>,
}));

vi.mock('./screens/DriverCockpit', () => ({
  DriverCockpit: () => <div data-testid="driver-screen">Driver Cockpit</div>,
}));

describe('Access Control & Screen Authorization Security', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('verifies in the RBAC configuration that Passenger is barred from admin screen', () => {
    const passengerScreens = ROLE_ALLOWED_SCREENS['Passenger'];
    expect(passengerScreens.includes('admin')).toBe(false);
  });

  it('ensures a Passenger session renders commuter screen and never displays the Admin Dashboard', () => {
    // Seed authenticated session for a Passenger
    const passengerSession = {
      id: 'usr-pass-1',
      name: 'R. Anitha (Commuter)',
      email: 'passenger@tgsrtc.gov.in',
      username: 'passenger',
      password: 'passenger123',
      role: 'Passenger' as const,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    };

    localStorage.setItem('tgsrtc_warangal_telangana_v12_auth', JSON.stringify(true));
    localStorage.setItem('tgsrtc_warangal_telangana_v12_user', JSON.stringify(passengerSession));

    render(<App />);

    // Passenger default screen (live-map) is rendered
    expect(screen.getByTestId('live-map-screen')).toBeInTheDocument();

    // Admin dashboard MUST NOT be rendered
    expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument();
  });

  it('allows Admin user to access the Admin Master Dashboard', () => {
    // Seed authenticated session for an Admin
    const adminSession = {
      id: 'usr-admin-1',
      name: 'Sri. K. V. Ramanathan, IPS',
      email: 'admin@tgsrtc.gov.in',
      username: 'admin',
      password: 'admin123',
      role: 'Admin' as const,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    };

    localStorage.setItem('tgsrtc_warangal_telangana_v12_auth', JSON.stringify(true));
    localStorage.setItem('tgsrtc_warangal_telangana_v12_user', JSON.stringify(adminSession));

    render(<App />);

    // Admin dashboard should be visible for Admin
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
  });
});
