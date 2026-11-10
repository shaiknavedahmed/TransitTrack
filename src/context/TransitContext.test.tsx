import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TransitProvider, useTransit } from './TransitContext';

describe('TransitContext Authentication & Role Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TransitProvider>{children}</TransitProvider>
  );

  describe('login()', () => {
    it('authenticates Admin with correct email and password', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        const response = result.current.login('admin@tgsrtc.gov.in', 'admin123');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser.role).toBe('Admin');
      expect(result.current.currentUser.email).toBe('admin@tgsrtc.gov.in');
    });

    it('authenticates Operator with operator credentials', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        const response = result.current.login('operator@tgsrtc.gov.in', 'operator123');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser.role).toBe('Transport Operator');
    });

    it('authenticates Driver with driver credentials', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        const response = result.current.login('driver@tgsrtc.gov.in', 'driver123');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser.role).toBe('Driver');
    });

    it('authenticates Passenger with commuter credentials', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        const response = result.current.login('passenger@tgsrtc.gov.in', 'passenger123');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser.role).toBe('Passenger');
    });

    it('authenticates user by username as well as email', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        const response = result.current.login('admin', 'admin123');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser.role).toBe('Admin');
    });

    it('rejects authentication with invalid password', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        const response = result.current.login('admin@tgsrtc.gov.in', 'wrongpassword');
        expect(response.success).toBe(false);
        expect(response.message).toContain('Invalid email/username or password');
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('rejects authentication with non-existent user identifier', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        const response = result.current.login('unknown@domain.com', 'admin123');
        expect(response.success).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout()', () => {
    it('sets isAuthenticated to false upon logging out', () => {
      const { result } = renderHook(() => useTransit(), { wrapper });

      act(() => {
        result.current.login('admin@tgsrtc.gov.in', 'admin123');
      });
      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
