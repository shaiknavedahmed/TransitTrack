import { describe, it, expect } from 'vitest';
import {
  ROLE_DEFAULT_SCREEN,
  ROLE_ALLOWED_SCREENS,
  ROLE_LABELS,
} from './roleConfig';
import { UserRole } from '../types';

describe('roleConfig', () => {
  const allRoles: UserRole[] = ['Admin', 'Transport Operator', 'Driver', 'Passenger'];

  describe('ROLE_DEFAULT_SCREEN', () => {
    it('defines a default landing screen for every role', () => {
      allRoles.forEach(role => {
        expect(ROLE_DEFAULT_SCREEN[role]).toBeDefined();
        expect(typeof ROLE_DEFAULT_SCREEN[role]).toBe('string');
      });
    });

    it('assigns the correct default dashboard screen to each role', () => {
      expect(ROLE_DEFAULT_SCREEN['Admin']).toBe('admin');
      expect(ROLE_DEFAULT_SCREEN['Transport Operator']).toBe('operator');
      expect(ROLE_DEFAULT_SCREEN['Driver']).toBe('driver');
      expect(ROLE_DEFAULT_SCREEN['Passenger']).toBe('live-map');
    });
  });

  describe('ROLE_ALLOWED_SCREENS (RBAC Matrix)', () => {
    it('grants Passenger access only to commuter screens, NOT admin or operator', () => {
      const passengerScreens = ROLE_ALLOWED_SCREENS['Passenger'];
      expect(passengerScreens).toContain('live-map');
      expect(passengerScreens).toContain('routes');
      expect(passengerScreens).toContain('feedback');

      // Crucial RBAC security boundary:
      expect(passengerScreens).not.toContain('admin');
      expect(passengerScreens).not.toContain('operator');
      expect(passengerScreens).not.toContain('driver');
      expect(passengerScreens).not.toContain('reports');
    });

    it('grants Driver access only to cockpit, live-map, and feedback', () => {
      const driverScreens = ROLE_ALLOWED_SCREENS['Driver'];
      expect(driverScreens).toContain('driver');
      expect(driverScreens).toContain('live-map');
      expect(driverScreens).toContain('feedback');

      expect(driverScreens).not.toContain('admin');
      expect(driverScreens).not.toContain('operator');
      expect(driverScreens).not.toContain('reports');
    });

    it('grants Admin access to admin master dashboard and regulatory reports', () => {
      const adminScreens = ROLE_ALLOWED_SCREENS['Admin'];
      expect(adminScreens).toContain('admin');
      expect(adminScreens).toContain('reports');
      expect(adminScreens).toContain('live-map');
      expect(adminScreens).toContain('operator');
    });

    it('grants Transport Operator access to operator console and dispatch tools', () => {
      const operatorScreens = ROLE_ALLOWED_SCREENS['Transport Operator'];
      expect(operatorScreens).toContain('operator');
      expect(operatorScreens).toContain('live-map');
      expect(operatorScreens).toContain('routes');
      expect(operatorScreens).toContain('reports');
      expect(operatorScreens).not.toContain('admin');
    });
  });

  describe('ROLE_LABELS', () => {
    it('provides both English and Telugu bilingual labels for each role', () => {
      allRoles.forEach(role => {
        const label = ROLE_LABELS[role];
        expect(label).toBeDefined();
        expect(label.en).toBeTruthy();
        expect(label.te).toBeTruthy();
      });
      expect(ROLE_LABELS['Admin'].te).toBe('మేనేజింగ్ డైరెక్టర్');
      expect(ROLE_LABELS['Passenger'].te).toBe('ప్రయాణీకుడు');
    });
  });
});
