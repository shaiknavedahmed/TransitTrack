export type UserRole = 'Admin' | 'Transport Operator' | 'Driver' | 'Passenger';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  badgeNumber?: string;
  operatorCompany?: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface TransitStop {
  id: string;
  code: string;
  name: string;
  location: GeoPoint;
  zone: string;
  amenities: ('Shelter' | 'Digital Display' | 'Wheelchair Access' | 'Bicycle Rack' | 'Ticket Kiosk')[];
  routesServed: string[]; // Route IDs
}

export type TransportMode = 'Bus' | 'Metro Rail' | 'Tram' | 'Express Shuttle';

export interface RouteStopSchedule {
  stopId: string;
  stopName: string;
  scheduledMinutesFromStart: number;
}

export interface TransitRoute {
  id: string;
  code: string;
  name: string;
  mode: TransportMode;
  color: string;
  description: string;
  operatingHours: string;
  frequencyMinutes: number;
  isPublished: boolean;
  stops: TransitStop[];
  waypoints: GeoPoint[];
  fare: number;
  totalDistanceKm: number;
  averageDurationMinutes: number;
}

export type VehicleStatus = 'In Service' | 'Idle / Depot' | 'Maintenance' | 'Delayed' | 'Off Duty';
export type OccupancyLevel = 'Empty' | 'Low' | 'Moderate' | 'Crowded' | 'Full';

export interface TransitVehicle {
  id: string;
  regNumber: string;
  model: string;
  mode: TransportMode;
  assignedRouteId: string | null;
  assignedDriverId: string | null;
  assignedDriverName?: string;
  status: VehicleStatus;
  currentLocation: GeoPoint;
  heading: number; // 0 to 360 degrees
  speedKmH: number;
  batteryOrFuelPercent: number;
  occupancy: OccupancyLevel;
  occupancyPercent: number;
  totalDistanceTodayKm: number;
  lastUpdated: string;
  currentStopIndex: number;
  isSimulating: boolean;
  delayMinutes: number;
  airConditioned: boolean;
  wifiEnabled: boolean;
}

export interface RouteScheduleItem {
  id: string;
  routeId: string;
  routeCode: string;
  routeName: string;
  tripId: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  departureTime: string; // "08:00 AM"
  arrivalTime: string;   // "08:50 AM"
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  dayType: 'Weekday' | 'Weekend' | 'Holiday';
  frequency: string;
  status: 'On Time' | 'Delayed' | 'Completed' | 'Cancelled';
  varianceMinutes: number;
  onTimeRate: number; // e.g. 96%
}

export interface PassengerFeedback {
  id: string;
  passengerName: string;
  isAnonymous: boolean;
  routeId: string;
  routeCode: string;
  vehicleId?: string;
  rating: number; // 1 to 5
  category: 'Punctuality' | 'Cleanliness' | 'Driving Safety' | 'Staff Behavior' | 'Crowding / Comfort' | 'App Experience';
  comment: string;
  timestamp: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  status: 'Pending' | 'Reviewed' | 'Resolved';
  adminResponse?: string;
}

export type DelayCause = 'Traffic Congestion' | 'Adverse Weather' | 'Mechanical Issue' | 'Road Construction' | 'Accident Clearance' | 'Signal Failure';

export interface ServiceDelay {
  id: string;
  routeId: string;
  routeCode: string;
  routeName: string;
  vehicleId?: string;
  delayMinutes: number;
  cause: DelayCause;
  affectedStops: string[];
  reportedByRole: UserRole;
  reportedByName: string;
  reportedAt: string;
  estimatedResolutionTime: string;
  status: 'Active' | 'Investigating' | 'Resolved';
  actionTaken: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface DriverShift {
  driverId: string;
  driverName: string;
  assignedVehicleId: string;
  assignedRouteId: string;
  shiftStart: string;
  shiftEnd: string;
  tripStatus: 'Not Started' | 'In Progress' | 'Break' | 'Completed';
  currentStopId?: string;
  nextStopId?: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}
