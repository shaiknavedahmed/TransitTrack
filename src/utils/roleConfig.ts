import { UserRole } from '../types';

export const ROLE_DEFAULT_SCREEN: Record<UserRole, string> = {
  Admin: 'admin',
  'Transport Operator': 'operator',
  Driver: 'driver',
  Passenger: 'live-map'
};

export const ROLE_ALLOWED_SCREENS: Record<UserRole, string[]> = {
  Admin: ['admin', 'reports', 'live-map', 'operator', 'routes', 'feedback', 'auth'],
  'Transport Operator': ['operator', 'live-map', 'routes', 'reports', 'feedback', 'auth'],
  Driver: ['driver', 'live-map', 'feedback', 'auth'],
  Passenger: ['live-map', 'routes', 'feedback', 'auth']
};

export const ROLE_LABELS: Record<UserRole, { en: string; te: string }> = {
  Admin: { en: 'Managing Director (Admin)', te: 'మేనేజింగ్ డైరెక్టర్' },
  'Transport Operator': { en: 'Regional Manager (Operator)', te: 'డివిజనల్ మేనేజర్' },
  Driver: { en: 'Staff Bus Driver', te: 'స్టాఫ్ డ్రైవర్' },
  Passenger: { en: 'Commuter / Passenger', te: 'ప్రయాణీకుడు' }
};

