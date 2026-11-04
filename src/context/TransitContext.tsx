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
  GeoPoint
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
  switchRole: (role: UserRole) => void;
  users: User[];
  
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

  // Management actions
  addRoute: (route: Omit<TransitRoute, 'id'>) => void;
  updateRoute: (route: TransitRoute) => void;
  togglePublishRoute: (routeId: string) => void;
  
  addStop: (stop: Omit<TransitStop, 'id'>) => void;
  updateStop: (stop: TransitStop) => void;
  
  updateVehicle: (vehicle: TransitVehicle) => void;
  updateDriverStatus: (vehicleId: string, speed: number, delayMinutes: number, occupancy: TransitVehicle['occupancy']) => void;
  
  submitFeedback: (feedback: Omit<PassengerFeedback, 'id' | 'timestamp' | 'status' | 'sentiment'>) => void;
  respondToFeedback: (id: string, response: string) => void;
  
  reportDelay: (delay: Omit<ServiceDelay, 'id' | 'reportedAt' | 'status'>) => void;
  resolveDelay: (id: string, actionNote: string) => void;

  logAction: (action: string, details: string) => void;
  resetToDefaults: () => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'metro_current_user_v1',
  ROUTES: 'metro_routes_v1',
  STOPS: 'metro_stops_v1',
  VEHICLES: 'metro_vehicles_v1',
  SCHEDULES: 'metro_schedules_v1',
  FEEDBACK: 'metro_feedback_v1',
  DELAYS: 'metro_delays_v1',
  LOGS: 'metro_audit_logs_v1'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error('Storage read error', e);
    return fallback;
  }
}

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadStorage<User>(STORAGE_KEYS.USER, INITIAL_USERS[0])
  );
  const [users] = useState<User[]>(INITIAL_USERS);

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

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

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
      timestamp: 'Just now',
      actor: currentUser.name,
      role: currentUser.role,
      action,
      details,
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const switchRole = (role: UserRole) => {
    const match = users.find(u => u.role === role) || {
      id: `usr-${role.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${role} User`,
      email: `${role.toLowerCase().replace(/\s+/g, '')}@metrotransit.org`,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
    };
    setCurrentUser(match);
    logAction('Role Switch', `User switched session profile to ${role}`);
  };

  // GPS SIMULATION ENGINE
  // Vehicles on active routes smoothly progress between waypoints
  const vehiclesRef = useRef(vehicles);
  vehiclesRef.current = vehicles;
  const routesRef = useRef(routes);
  routesRef.current = routes;

  // Waypoint progress index per vehicle: { [vehId]: progressFraction 0..1 }
  const vehicleProgressRef = useRef<{ [vehId: string]: { waypointIndex: number; fraction: number; direction: 1 | -1 } }>({
    'veh-101A': { waypointIndex: 1, fraction: 0.2, direction: 1 },
    'veh-101B': { waypointIndex: 4, fraction: 0.6, direction: 1 },
    'veh-204A': { waypointIndex: 2, fraction: 0.4, direction: 1 },
    'veh-305A': { waypointIndex: 1, fraction: 0.7, direction: 1 },
    'veh-408A': { waypointIndex: 3, fraction: 0.3, direction: 1 }
  });

  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      const step = 0.08 * simulationSpeed;
      const currentRoutes = routesRef.current;

      setVehicles(prevVehicles => {
        return prevVehicles.map(veh => {
          if (!veh.isSimulating || !veh.assignedRouteId || veh.status !== 'In Service') {
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
              // Reverse direction or loop
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

          // Simulated speed variations
          const baseSpeed = veh.mode === 'Express Shuttle' ? 65 : veh.mode === 'Tram' ? 40 : 32;
          const currentSpeed = Math.max(15, Math.min(80, Math.round(baseSpeed + (Math.sin(Date.now() / 3000) * 10))));

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

  // Actions
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
    logAction('Update Route', `Updated route configuration for ${route.code}`);
  };

  const togglePublishRoute = (routeId: string) => {
    setRoutes(prev =>
      prev.map(r => {
        if (r.id === routeId) {
          const next = !r.isPublished;
          logAction(
            next ? 'Publish Route' : 'Unpublish Route',
            `${next ? 'Published' : 'Unpublished'} timetable and live tracking for Route ${r.code}`
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

  const updateVehicle = (vehicle: TransitVehicle) => {
    setVehicles(prev => prev.map(v => (v.id === vehicle.id ? vehicle : v)));
    logAction('Fleet Update', `Modified vehicle attributes for ${vehicle.regNumber}`);
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
    logAction('Passenger Feedback', `New ${newFb.rating}-star review received on Route ${newFb.routeCode}`);
  };

  const respondToFeedback = (id: string, response: string) => {
    setFeedbacks(prev =>
      prev.map(fb => (fb.id === id ? { ...fb, adminResponse: response, status: 'Reviewed' } : fb))
    );
    logAction('Feedback Response', `Official response provided for feedback #${id}`);
  };

  const reportDelay = (delayData: Omit<ServiceDelay, 'id' | 'reportedAt' | 'status'>) => {
    const newDelay: ServiceDelay = {
      ...delayData,
      id: `dly-${Date.now().toString().slice(-4)}`,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active'
    };
    setDelays(prev => [newDelay, ...prev]);

    // Also update matching vehicle delay
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
    setCurrentUser(INITIAL_USERS[0]);
    logAction('System Reset', 'All transit databases restored to default specifications');
  };

  return (
    <TransitContext.Provider
      value={{
        currentUser,
        switchRole,
        users,
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
        updateDriverStatus,
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
