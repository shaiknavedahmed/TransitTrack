import { describe, it, expect } from 'vitest';
import {
  calculateDistanceKm,
  calculateBearing,
  interpolateGeoPoint,
  formatCoord,
} from './geoUtils';
import { GeoPoint } from '../types';

describe('geoUtils', () => {
  // Known coordinates in Telangana:
  // Hanamkonda Bus Station: 17.9962, 79.5603
  // Warangal Railway Station: 17.9689, 79.5941
  const hanamkondaBS: GeoPoint = { lat: 17.9962, lng: 79.5603 };
  const warangalRS: GeoPoint = { lat: 17.9689, lng: 79.5941 };

  describe('calculateDistanceKm', () => {
    it('returns 0 when calculating distance to the same point', () => {
      const dist = calculateDistanceKm(hanamkondaBS, hanamkondaBS);
      expect(dist).toBe(0);
    });

    it('calculates accurate Haversine distance between Hanamkonda and Warangal (~4.6 km)', () => {
      const dist = calculateDistanceKm(hanamkondaBS, warangalRS);
      // Distance is ~4.74 km
      expect(dist).toBeGreaterThan(4);
      expect(dist).toBeLessThan(6);
    });

    it('is symmetric (dist(A, B) === dist(B, A))', () => {
      const d1 = calculateDistanceKm(hanamkondaBS, warangalRS);
      const d2 = calculateDistanceKm(warangalRS, hanamkondaBS);
      expect(d1).toBeCloseTo(d2, 5);
    });
  });

  describe('calculateBearing', () => {
    it('calculates correct bearing angle between 0 and 360 degrees', () => {
      const bearing = calculateBearing(hanamkondaBS, warangalRS);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThanOrEqual(360);
      // Moving South-East: bearing roughly between 120 and 160 deg
      expect(bearing).toBeGreaterThan(100);
      expect(bearing).toBeLessThan(180);
    });

    it('calculates North bearing (0 degrees) for points along same longitude moving north', () => {
      const p1: GeoPoint = { lat: 17.0, lng: 79.0 };
      const p2: GeoPoint = { lat: 18.0, lng: 79.0 };
      const bearing = calculateBearing(p1, p2);
      expect(bearing).toBeCloseTo(0, 1);
    });
  });

  describe('interpolateGeoPoint', () => {
    it('returns starting point when fraction is 0', () => {
      const point = interpolateGeoPoint(hanamkondaBS, warangalRS, 0);
      expect(point.lat).toBeCloseTo(hanamkondaBS.lat);
      expect(point.lng).toBeCloseTo(hanamkondaBS.lng);
    });

    it('returns ending point when fraction is 1', () => {
      const point = interpolateGeoPoint(hanamkondaBS, warangalRS, 1);
      expect(point.lat).toBeCloseTo(warangalRS.lat);
      expect(point.lng).toBeCloseTo(warangalRS.lng);
    });

    it('returns midpoint when fraction is 0.5', () => {
      const mid = interpolateGeoPoint(hanamkondaBS, warangalRS, 0.5);
      const expectedLat = (hanamkondaBS.lat + warangalRS.lat) / 2;
      const expectedLng = (hanamkondaBS.lng + warangalRS.lng) / 2;
      expect(mid.lat).toBeCloseTo(expectedLat, 4);
      expect(mid.lng).toBeCloseTo(expectedLng, 4);
    });

    it('clamps fraction between 0 and 1 when out of range', () => {
      const below = interpolateGeoPoint(hanamkondaBS, warangalRS, -0.5);
      expect(below.lat).toBeCloseTo(hanamkondaBS.lat);

      const above = interpolateGeoPoint(hanamkondaBS, warangalRS, 1.5);
      expect(above.lat).toBeCloseTo(warangalRS.lat);
    });
  });

  describe('formatCoord', () => {
    it('formats a coordinate number to 5 decimal places', () => {
      expect(formatCoord(17.996234)).toBe('17.99623');
      expect(formatCoord(79.56)).toBe('79.56000');
    });
  });
});
