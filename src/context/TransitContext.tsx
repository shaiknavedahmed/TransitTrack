import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  UserRole,
  TransitRoute,
  TransitStop,
  TransitVehicle,
  RouteScheduleItem,
  PassengerFeedback,
  ServiceDelay,
  SystemAuditLog,
  GeoPoint,
  VehicleStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROUTES,
  INITIAL_STOPS,
  INITIAL_VEHICLES,
  INITIAL_SCHEDULE_REPORTS,
  INITIAL_FEEDBACK,
  INITIAL_SERVICE_DELAYS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { calculateBearing, interpolateGeoPoint } from '../utils/geoUtils';

interface TransitContextType {
  currentUser: User;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  addUser: (user: User) => void;
  
  routes: TransitRoute[];
  stops: TransitStop[];
  vehicles: TransitVehicle[];
  schedules: RouteScheduleItem[];
  feedbacks: PassengerFeedback[];
  delays: ServiceDelay[];
  auditLogs: SystemAuditLog[];

  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;

  // Simulation controls
  isSimulationRunning: boolean;
  setIsSimulationRunning: (running: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;

  // Route & Stop Management
  addRoute: (route: Omit<TransitRoute, 'id'>) => void;
  updateRoute: (route: TransitRoute) => void;
  togglePublishRoute: (routeId: string) => void;
  addStop: (stop: Omit<TransitStop, 'id'>) => void;
  updateStop: (stop: TransitStop) => void;
  
  // Fleet & Dispatch Management
  updateVehicle: (vehicle: TransitVehicle) => void;
  assignVehicle: (vehicleId: string, routeId: string | null, driverId: string | null) => { success: boolean; message?: string };
  setVehicleMaintenance: (vehicleId: string, inMaintenance: boolean) => void;
  updateDriverStatus: (vehicleId: string, speed: number, delayMinutes: number, occupancy: TransitVehicle['occupancy']) => void;
  
  // Driver Trip Controls
  startTrip: (vehicleId: string, tripId?: string) => void;
  pauseTrip: (vehicleId: string) => void;
  resumeTrip: (vehicleId: string) => void;
  completeTrip: (vehicleId: string, tripId?: string) => void;

  // Timetable Scheduling
  addSchedule: (item: Omit<RouteScheduleItem, 'id'>) => void;
  updateSchedule: (item: RouteScheduleItem) => void;
  deleteSchedule: (id: string) => void;
  
  // Feedback
  submitFeedback: (feedback: Omit<PassengerFeedback, 'id' | 'timestamp' | 'status' | 'sentiment'>) => void;
  respondToFeedback: (id: string, response: string) => void;
  
  // Delay & Incident Alerts
  reportDelay: (delay: Omit<ServiceDelay, 'id' | 'reportedAt' | 'status'>) => void;
  resolveDelay: (id: string, actionNote: string) => void;

  logAction: (action: string, details: string) => void;
  resetToDefaults: () => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'tgsrtc_warangal_telangana_v12_auth',
  USER: 'tgsrtc_warangal_telangana_v12_user',
  USERS_LIST: 'tgsrtc_warangal_telangana_v12_users_list',
  ROUTES: 'tgsrtc_warangal_telangana_v12_routes',
  STOPS: 'tgsrtc_warangal_telangana_v12_stops',
  VEHICLES: 'tgsrtc_warangal_telangana_v12_vehicles',
  SCHEDULES: 'tgsrtc_warangal_telangana_v12_schedules',
  FEEDBACK: 'tgsrtc_warangal_telangana_v12_feedback',
  DELAYS: 'tgsrtc_warangal_telangana_v12_delays',
  LOGS: 'tgsrtc_warangal_telangana_v12_logs'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined') {
      // Purge old versions
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('metro_') || (k.startsWith('tgsrtc_') && !k.startsWith('tgsrtc_warangal_telangana_v12_')))) {
          try { localStorage.removeItem(k); } catch (e) {}
        }
      }
    }

    const saved = localStorage.getItem(key);
    if (!saved) return fallback;

    const parsed = JSON.parse(saved);

    // Geographic and integrity validation
    if (Array.isArray(parsed)) {
      if (parsed.some((item: any) => item?.location && (item.location.lng < 75 || item.location.lng > 83 || item.location.lat < 15 || item.location.lat > 22))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (parsed.some((item: any) => item?.currentLocation && (item.currentLocation.lng < 75 || item.currentLocation.lng > 83 || item.currentLocation.lat < 15 || item.currentLocation.lat > 22))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (parsed.some((item: any) => item?.regNumber && item.regNumber.startsWith('BUS-'))) {
        localStorage.removeItem(key);
        return fallback;
      }
    }

    return parsed;
  } catch (e) {
    console.error('Storage read error', e);
    return fallback;
  }
}

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadStorage<boolean>(STORAGE_KEYS.AUTH, false)
  );

  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadStorage<User>(STORAGE_KEYS.USER, INITIAL_USERS[0])
  );

  const [users, setUsers] = useState<User[]>(() =>
    loadStorage<User[]>(STORAGE_KEYS.USERS_LIST, INITIAL_USERS)
  );

  const [routes, setRoutes] = useState<TransitRoute[]>(() =>
    loadStorage<TransitRoute[]>(STORAGE_KEYS.ROUTES, INITIAL_ROUTES)
  );
  const [stops, setStops] = useState<TransitStop[]>(() =>
    loadStorage<TransitStop[]>(STORAGE_KEYS.STOPS, INITIAL_STOPS)
  );
  const [vehicles, setVehicles] = useState<TransitVehicle[]>(() =>
    loadStorage<TransitVehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES)
  );
  const [schedules, setSchedules] = useState<RouteScheduleItem[]>(() =>
    loadStorage<RouteScheduleItem[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULE_REPORTS)
  );
  const [feedbacks, setFeedbacks] = useState<PassengerFeedback[]>(() =>
    loadStorage<PassengerFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK)
  );
  const [delays, setDelays] = useState<ServiceDelay[]>(() =>
    loadStorage<ServiceDelay[]>(STORAGE_KEYS.DELAYS, INITIAL_SERVICE_DELAYS)
  );
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() =>
    loadStorage<SystemAuditLog[]>(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS)
  );

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route-101');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('veh-101A');

  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOPS, JSON.stringify(stops));
  }, [stops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELAYS, JSON.stringify(delays));
  }, [delays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAction = (action: string, details: string) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: currentUser?.name || 'System',
      role: currentUser?.role || 'Passenger',
      action,
      details,
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // AUTHENTICATION LOGIC
  const login = (usernameOrEmail: string, password: string): { success: boolean; message?: string } => {
    const input = usernameOrEmail.trim().toLowerCase();
    const userMatch = users.find(u => {
      const matchEmail = u.email.toLowerCase() === input;
      const matchUsername = u.username ? u.username.toLowerCase() === input : false;
      const matchRole = u.role.toLowerCase() === input || u.role.toLowerCase().replace(/\s+/g, '') === input;
      return (matchEmail || matchUsername || matchRole) && (u.password ? u.password === password : password === 'admin123' || password === 'operator123' || password === 'driver123' || password === 'passenger123');
    });

    if (userMatch) {
      setCurrentUser(userMatch);
      setIsAuthenticated(true);
      logAction('User Login', `Authenticated session established for ${userMatch.name} (${userMatch.role})`);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid email/username or password. Please use demo credentials displayed below.'
    };
  };

  const logout = () => {
    logAction('User Logout', `User ${currentUser.name} signed out`);
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    const match = users.find(u => u.role === role) || {
      id: `usr-${role.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${role} User`,
      email: `${role.toLowerCase().replace(/\s+/g, '')}@tgsrtc.gov.in`,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
    };
    setCurrentUser(match);
    setIsAuthenticated(true);
    logAction('Role Switch', `User switched session profile to ${role}`);
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    logAction('Staff Onboarded', `Added ${newUser.role}: ${newUser.name} (${newUser.badgeNumber || 'N/A'})`);
  };

  // GPS SIMULATION ENGINE
  const vehiclesRef = useRef(vehicles);
  vehiclesRef.current = vehicles;
  const routesRef = useRef(routes);
  routesRef.current = routes;

  // Waypoint progress index per vehicle: { [vehId]: progressFraction 0..1 }
  const vehicleProgressRef = useRef<{ [vehId: string]: { waypointIndex: number; fraction: number; direction: 1 | -1 } }>({
    'veh-101A': { waypointIndex: 2, fraction: 0.3, direction: 1 },
    'veh-101B': { waypointIndex: 4, fraction: 0.6, direction: 1 },
    'veh-204A': { waypointIndex: 2, fraction: 0.4, direction: 1 },
    'veh-305A': { waypointIndex: 2, fraction: 0.5, direction: 1 },
    'veh-408A': { waypointIndex: 3, fraction: 0.3, direction: 1 },
    'veh-502A': { waypointIndex: 1, fraction: 0.4, direction: 1 }
  });

  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      const step = 0.08 * simulationSpeed;
      const currentRoutes = routesRef.current;

      setVehicles(prevVehicles => {
        return prevVehicles.map(veh => {
          // STRICT BUSINESS RULE:
          // A vehicle only moves if:
          // 1. isSimulating is true
          // 2. assignedRouteId is valid
          // 3. assignedDriverId is valid
          // 4. status is 'In Service' (not Maintenance, not Idle / Depot, not Off Duty)
          if (!veh.isSimulating || !veh.assignedRouteId || !veh.assignedDriverId || veh.status !== 'In Service') {
            return veh;
          }

          const route = currentRoutes.find(r => r.id === veh.assignedRouteId);
          if (!route || route.waypoints.length < 2) return veh;

          const progress = vehicleProgressRef.current[veh.id] || {
            waypointIndex: 0,
            fraction: 0,
            direction: 1
          };

          let { waypointIndex, fraction, direction } = progress;
          fraction += step * direction;

          if (fraction >= 1) {
            fraction = 0;
            waypointIndex += direction;
            if (waypointIndex >= route.waypoints.length - 1) {
              waypointIndex = route.waypoints.length - 2;
              direction = -1;
            }
          } else if (fraction <= 0 && direction === -1) {
            fraction = 1;
            waypointIndex += direction;
            if (waypointIndex < 0) {
              waypointIndex = 0;
              direction = 1;
            }
          }

          vehicleProgressRef.current[veh.id] = { waypointIndex, fraction, direction };

          const p1 = route.waypoints[waypointIndex];
          const p2 = route.waypoints[waypointIndex + (direction === 1 ? 1 : -1)] || route.waypoints[waypointIndex];
          const newPos: GeoPoint = interpolateGeoPoint(p1, p2, fraction);
          const heading = calculateBearing(p1, p2);

          const baseSpeed =
            veh.mode === 'Super Luxury' || veh.mode === 'Deluxe'
              ? 58
              : veh.mode === 'Electric EV'
              ? 42
              : 30;
          const currentSpeed = Math.max(12, Math.min(80, Math.round(baseSpeed + (Math.sin(Date.now() / 3000) * 8))));

          return {
            ...veh,
            currentLocation: newPos,
            heading,
            speedKmH: currentSpeed,
            totalDistanceTodayKm: Number((veh.totalDistanceTodayKm + 0.02 * simulationSpeed).toFixed(2)),
            lastUpdated: 'Just now'
          };
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulationRunning, simulationSpeed]);

  // ROUTE & STOP ACTIONS
  const addRoute = (routeData: Omit<TransitRoute, 'id'>) => {
    const newRoute: TransitRoute = {
      ...routeData,
      id: `route-${Date.now().toString().slice(-4)}`
    };
    setRoutes(prev => [...prev, newRoute]);
    logAction('Create Route', `Created route ${newRoute.code} - ${newRoute.name}`);
  };

  const updateRoute = (route: TransitRoute) => {
    setRoutes(prev => prev.map(r => (r.id === route.id ? route : r)));
    logAction('Update Route', `Updated route configuration for Line ${route.code} (${route.name})`);
  };

  const togglePublishRoute = (routeId: string) => {
    setRoutes(prev =>
      prev.map(r => {
        if (r.id === routeId) {
          const next = !r.isPublished;
          logAction(
            next ? 'Publish Route' : 'Unpublish Route',
            `${next ? 'Published' : 'Unpublished'} timetable and tracking for Line ${r.code}`
          );
          return { ...r, isPublished: next };
        }
        return r;
      })
    );
  };

  const addStop = (stopData: Omit<TransitStop, 'id'>) => {
    const newStop: TransitStop = {
      ...stopData,
      id: `stop-${Date.now().toString().slice(-4)}`
    };
    setStops(prev => [...prev, newStop]);
    logAction('Add Stop', `Added new transit stop: ${newStop.name} (${newStop.code})`);
  };

  const updateStop = (stop: TransitStop) => {
    setStops(prev => prev.map(s => (s.id === stop.id ? stop : s)));
    logAction('Update Stop', `Modified transit stop: ${stop.name}`);
  };

  // FLEET & VEHICLE MANAGEMENT
  const updateVehicle = (vehicle: TransitVehicle) => {
    setVehicles(prev => prev.map(v => (v.id === vehicle.id ? vehicle : v)));
    logAction('Fleet Update', `Modified vehicle attributes for ${vehicle.regNumber}`);
  };

  const assignVehicle = (
    vehicleId: string,
    routeId: string | null,
    driverId: string | null
  ): { success: boolean; message?: string } => {
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) return { success: false, message: 'Vehicle not found' };

    // Validation: Maintenance vehicle cannot be assigned
    if (veh.status === 'Maintenance') {
      return {
        success: false,
        message: `Cannot dispatch ${veh.regNumber}. Vehicle is in Maintenance Depot.`
      };
    }

    // Driver name lookup & conflict check
    let driverName: string | undefined = undefined;
    if (driverId) {
      const driverUser = users.find(u => u.id === driverId);
      driverName = driverUser?.name;

      // Check if driver is already driving another in-service vehicle
      const conflictVeh = vehicles.find(
        v => v.id !== vehicleId && v.assignedDriverId === driverId && v.status === 'In Service'
      );
      if (conflictVeh) {
        return {
          success: false,
          message: `Driver ${driverName} is already assigned to active bus ${conflictVeh.regNumber}.`
        };
      }
    }

    const updatedStatus: VehicleStatus = routeId && driverId ? 'In Service' : 'Idle / Depot';
    const isSimulating = updatedStatus === 'In Service';

    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? {
              ...v,
              assignedRouteId: routeId,
              assignedDriverId: driverId,
              assignedDriverName: driverName,
              status: updatedStatus,
              isSimulating,
              speedKmH: isSimulating ? 30 : 0
            }
          : v
      )
    );

    logAction(
      'Fleet Dispatch',
      `Assigned bus ${veh.regNumber} to Route ${routeId || 'None'} with Driver ${driverName || 'None'}`
    );
    return { success: true };
  };

  const setVehicleMaintenance = (vehicleId: string, inMaintenance: boolean) => {
    setVehicles(prev =>
      prev.map(v => {
        if (v.id === vehicleId) {
          const newStatus: VehicleStatus = inMaintenance ? 'Maintenance' : 'Idle / Depot';
          return {
            ...v,
            status: newStatus,
            isSimulating: false,
            speedKmH: 0,
            assignedDriverId: inMaintenance ? null : v.assignedDriverId,
            assignedDriverName: inMaintenance ? undefined : v.assignedDriverName
          };
        }
        return v;
      })
    );

    const veh = vehicles.find(v => v.id === vehicleId);
    logAction(
      inMaintenance ? 'Maintenance Dispatch' : 'Maintenance Cleared',
      inMaintenance
        ? `Bus ${veh?.regNumber} dispatched to depot maintenance`
        : `Bus ${veh?.regNumber} released from maintenance to depot bay`
    );
  };

  const updateDriverStatus = (
    vehicleId: string,
    speed: number,
    delayMinutes: number,
    occupancy: TransitVehicle['occupancy']
  ) => {
    const occPercents: Record<TransitVehicle['occupancy'], number> = {
      Empty: 0,
      Low: 25,
      Moderate: 60,
      Crowded: 85,
      Full: 100
    };

    setVehicles(prev =>
      prev.map(v => {
        if (v.id === vehicleId) {
          return {
            ...v,
            speedKmH: speed,
            delayMinutes,
            occupancy,
            occupancyPercent: occPercents[occupancy],
            status: delayMinutes > 5 ? 'Delayed' : 'In Service',
            lastUpdated: 'Just now'
          };
        }
        return v;
      })
    );
  };

  // DRIVER TRIP CONTROLS
  const startTrip = (vehicleId: string, tripId?: string) => {
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? { ...v, status: 'In Service', isSimulating: true, speedKmH: 35, lastUpdated: 'Just now' }
          : v
      )
    );

    if (tripId) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSchedules(prev =>
        prev.map(s => (s.tripId === tripId ? { ...s, actualDepartureTime: nowStr, status: 'On Time' } : s))
      );
    }

    const veh = vehicles.find(v => v.id === vehicleId);
    logAction('Trip Started', `Driver ${currentUser.name} started trip on bus ${veh?.regNumber}`);
  };

  const pauseTrip = (vehicleId: string) => {
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? { ...v, status: 'Idle / Depot', isSimulating: false, speedKmH: 0, lastUpdated: 'Just now' }
          : v
      )
    );

    const veh = vehicles.find(v => v.id === vehicleId);
    logAction('Trip Paused', `Driver ${currentUser.name} paused bus ${veh?.regNumber} at station layover`);
  };

  const resumeTrip = (vehicleId: string) => {
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? { ...v, status: 'In Service', isSimulating: true, speedKmH: 35, lastUpdated: 'Just now' }
          : v
      )
    );

    const veh = vehicles.find(v => v.id === vehicleId);
    logAction('Trip Resumed', `Driver ${currentUser.name} resumed route transit on bus ${veh?.regNumber}`);
  };

  const completeTrip = (vehicleId: string, tripId?: string) => {
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? { ...v, status: 'Off Duty', isSimulating: false, speedKmH: 0, delayMinutes: 0, lastUpdated: 'Just now' }
          : v
      )
    );

    if (tripId) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSchedules(prev =>
        prev.map(s => (s.tripId === tripId ? { ...s, actualArrivalTime: nowStr, status: 'Completed' } : s))
      );
    }

    const veh = vehicles.find(v => v.id === vehicleId);
    logAction('Trip Completed', `Driver ${currentUser.name} completed trip and ended shift on bus ${veh?.regNumber}`);
  };

  // TIMETABLE SCHEDULING ACTIONS
  const addSchedule = (itemData: Omit<RouteScheduleItem, 'id'>) => {
    const newSchedule: RouteScheduleItem = {
      ...itemData,
      id: `sch-${Date.now().toString().slice(-4)}`
    };
    setSchedules(prev => [newSchedule, ...prev]);
    logAction('Schedule Added', `Added trip ${newSchedule.tripId} for Line ${newSchedule.routeCode}`);
  };

  const updateSchedule = (item: RouteScheduleItem) => {
    setSchedules(prev => prev.map(s => (s.id === item.id ? item : s)));
    logAction('Schedule Updated', `Updated timetable trip ${item.tripId}`);
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    logAction('Schedule Deleted', `Removed timetable entry #${id}`);
  };

  // PASSENGER FEEDBACK ACTIONS
  const submitFeedback = (
    feedbackData: Omit<PassengerFeedback, 'id' | 'timestamp' | 'status' | 'sentiment'>
  ) => {
    let sentiment: PassengerFeedback['sentiment'] = 'Neutral';
    if (feedbackData.rating >= 4) sentiment = 'Positive';
    else if (feedbackData.rating <= 2) sentiment = 'Negative';

    const newFb: PassengerFeedback = {
      ...feedbackData,
      id: `fb-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      sentiment,
      status: 'Pending'
    };
    setFeedbacks(prev => [newFb, ...prev]);
    logAction('Passenger Feedback', `New ${newFb.rating}-star review on Route ${newFb.routeCode}`);
  };

  const respondToFeedback = (id: string, response: string) => {
    setFeedbacks(prev =>
      prev.map(fb => (fb.id === id ? { ...fb, adminResponse: response, status: 'Reviewed' } : fb))
    );
    logAction('Feedback Redressal', `Official response provided for feedback #${id}`);
  };

  // SERVICE DELAY & INCIDENT MANAGEMENT
  const reportDelay = (delayData: Omit<ServiceDelay, 'id' | 'reportedAt' | 'status'>) => {
    const newDelay: ServiceDelay = {
      ...delayData,
      id: `dly-${Date.now().toString().slice(-4)}`,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active'
    };
    setDelays(prev => [newDelay, ...prev]);

    // Synchronize vehicle delay
    if (newDelay.vehicleId) {
      setVehicles(prev =>
        prev.map(v =>
          v.regNumber === newDelay.vehicleId || v.id === newDelay.vehicleId
            ? { ...v, delayMinutes: newDelay.delayMinutes, status: 'Delayed' }
            : v
        )
      );
    }
    logAction(
      'Service Delay Alert',
      `Delay alert issued: Route ${newDelay.routeCode} (+${newDelay.delayMinutes}m due to ${newDelay.cause})`
    );
  };

  const resolveDelay = (id: string, actionNote: string) => {
    const delayItem = delays.find(d => d.id === id);
    setDelays(prev =>
      prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status: 'Resolved',
            actionTaken: actionNote
          };
        }
        return d;
      })
    );

    // Reset vehicle delay if tied to this delay
    if (delayItem?.vehicleId) {
      setVehicles(prev =>
        prev.map(v =>
          v.regNumber === delayItem.vehicleId || v.id === delayItem.vehicleId
            ? { ...v, delayMinutes: 0, status: 'In Service' }
            : v
        )
      );
    }

    logAction('Delay Resolved', `Delay #${id} marked as resolved: ${actionNote}`);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setRoutes(INITIAL_ROUTES);
    setStops(INITIAL_STOPS);
    setVehicles(INITIAL_VEHICLES);
    setSchedules(INITIAL_SCHEDULE_REPORTS);
    setFeedbacks(INITIAL_FEEDBACK);
    setDelays(INITIAL_SERVICE_DELAYS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setIsAuthenticated(false);
    logAction('System Reset', 'All transit databases restored to default specifications');
  };

  return (
    <TransitContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        users,
        addUser,
        routes,
        stops,
        vehicles,
        schedules,
        feedbacks,
        delays,
        auditLogs,
        selectedRouteId,
        setSelectedRouteId,
        selectedVehicleId,
        setSelectedVehicleId,
        isSimulationRunning,
        setIsSimulationRunning,
        simulationSpeed,
        setSimulationSpeed,
        addRoute,
        updateRoute,
        togglePublishRoute,
        addStop,
        updateStop,
        updateVehicle,
        assignVehicle,
        setVehicleMaintenance,
        updateDriverStatus,
        startTrip,
        pauseTrip,
        resumeTrip,
        completeTrip,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        submitFeedback,
        respondToFeedback,
        reportDelay,
        resolveDelay,
        logAction,
        resetToDefaults
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
