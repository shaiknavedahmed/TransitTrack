import { GeoPoint } from '../types';

export function calculateDistanceKm(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateBearing(start: GeoPoint, end: GeoPoint): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const brng = Math.atan2(y, x);
  return (((brng * 180) / Math.PI) + 360) % 360;
}

export function interpolateGeoPoint(p1: GeoPoint, p2: GeoPoint, fraction: number): GeoPoint {
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  return {
    lat: p1.lat + (p2.lat - p1.lat) * clampedFraction,
    lng: p1.lng + (p2.lng - p1.lng) * clampedFraction,
  };
}

export function formatCoord(val: number): string {
  return val.toFixed(5);
}
