import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  TransitRoute,
  TransitStop,
  TransitVehicle,
  TransportMode,
  DelayCause,
  VehicleStatus,
  RouteScheduleItem
} from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  Sliders,
  MapPin,
  Bus,
  Calendar,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Layers,
  Wrench,
  Check,
  Send,
  MessageSquare,
  Search,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const OperatorScreen: React.FC = () => {
  const {
    routes,
    stops,
    vehicles,
    schedules,
    delays,
    feedbacks,
    users,
    addRoute,
    updateRoute,
    togglePublishRoute,
    addStop,
    updateVehicle,
    assignVehicle,
    setVehicleMaintenance,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    reportDelay,
    resolveDelay,
    respondToFeedback
  } = useTransit();

  const [activeTab, setActiveTab] = useState<'routes' | 'stops' | 'schedules' | 'fleet' | 'delays' | 'feedback'>('routes');
  const [notification, setNotification] = useState<string | null>(null);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setErrorNotification(null);
    setTimeout(() => setNotification(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setNotification(null);
    setTimeout(() => setErrorNotification(null), 5000);
  };

  // 1. ROUTE MODAL (Create & Edit)
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [routeCode, setRouteCode] = useState('');
  const [routeName, setRouteName] = useState('');
  const [routeTeluguName, setRouteTeluguName] = useState('');
  const [routeMode, setRouteMode] = useState<TransportMode>('Metro Express');
  const [routeColor, setRouteColor] = useState('#0d6e52');
  const [routeHours, setRouteHours] = useState('05:30 AM - 10:30 PM IST');
  const [routeFreq, setRouteFreq] = useState(15);
  const [routeFare, setRouteFare] = useState(30);
  const [routeDesc, setRouteDesc] = useState('');

  const openCreateRoute = () => {
    setEditingRouteId(null);
    setRouteCode('');
    setRouteName('');
    setRouteTeluguName('');
    setRouteMode('Metro Express');
    setRouteColor('#0d6e52');
    setRouteHours('05:30 AM - 10:30 PM IST');
    setRouteFreq(15);
    setRouteFare(30);
    setRouteDesc('');
    setRouteModalOpen(true);
  };

  const openEditRoute = (r: TransitRoute) => {
    setEditingRouteId(r.id);
    setRouteCode(r.code);
    setRouteName(r.name);
    setRouteTeluguName(r.teluguName || '');
    setRouteMode(r.mode);
    setRouteColor(r.color);
    setRouteHours(r.operatingHours);
    setRouteFreq(r.frequencyMinutes);
    setRouteFare(r.fare);
    setRouteDesc(r.description);
    setRouteModalOpen(true);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeCode || !routeName) return;

    if (editingRouteId) {
      const existing = routes.find(r => r.id === editingRouteId);
      if (existing) {
        updateRoute({
          ...existing,
          code: routeCode,
          name: routeName,
          teluguName: routeTeluguName,
          mode: routeMode,
          color: routeColor,
          operatingHours: routeHours,
          frequencyMinutes: Number(routeFreq),
          fare: Number(routeFare),
          description: routeDesc || existing.description
        });
        showSuccess(`Route Line ${routeCode} updated! Changes are now live for passengers.`);
      }
    } else {
      addRoute({
        code: routeCode,
        name: routeName,
        teluguName: routeTeluguName,
        mode: routeMode,
        color: routeColor,
        description: routeDesc || `Corridor service connecting major central districts via ${routeName}.`,
        operatingHours: routeHours,
        frequencyMinutes: Number(routeFreq),
        isPublished: true,
        stops: [stops[0], stops[1], stops[2] || stops[0]],
        waypoints: [stops[0].location, stops[1].location],
        fare: Number(routeFare),
        totalDistanceKm: 12.0,
        averageDurationMinutes: 35
      });
      showSuccess(`New Route Line ${routeCode} created and published to passengers!`);
    }

    setRouteModalOpen(false);
  };

  // 2. STOP MODAL
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [stopCode, setStopCode] = useState('');
  const [stopName, setStopName] = useState('');
  const [stopTelugu, setStopTelugu] = useState('');
  const [stopLat, setStopLat] = useState('17.9784');
  const [stopLng, setStopLng] = useState('79.5941');
  const [stopZone, setStopZone] = useState('Warangal Central Corridor');

  const handleSaveStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stopName || !stopCode) return;

    addStop({
      code: stopCode.toUpperCase(),
      name: stopName,
      teluguName: stopTelugu,
      location: { lat: parseFloat(stopLat), lng: parseFloat(stopLng) },
      zone: stopZone,
      amenities: ['Shelter', 'Digital Display', 'Wheelchair Access'],
      routesServed: [routes[0]?.id || 'route-101']
    });

    setStopCode('');
    setStopName('');
    setStopTelugu('');
    setStopModalOpen(false);
    showSuccess(`Station stop ${stopName} added to Telangana GIS!`);
  };

  // 3. SCHEDULE MODAL
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schRouteId, setSchRouteId] = useState(routes[0]?.id || '');
  const [schVehId, setSchVehId] = useState(vehicles[0]?.regNumber || '');
  const [schDriverId, setSchDriverId] = useState(users.find(u => u.role === 'Driver')?.id || '');
  const [schDepTime, setSchDepTime] = useState('07:30 AM');
  const [schArrTime, setSchArrTime] = useState('08:15 AM');
  const [schPlatform, setSchPlatform] = useState('Bay #2');

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const route = routes.find(r => r.id === schRouteId);
    const driver = users.find(u => u.id === schDriverId);
    if (!route) return;

    addSchedule({
      routeId: route.id,
      routeCode: route.code,
      routeName: route.name,
      tripId: `TR-${route.code}-${Math.floor(100 + Math.random() * 900)}`,
      vehicleId: schVehId,
      driverId: schDriverId,
      driverName: driver?.name || 'Assigned Driver',
      departureTime: schDepTime,
      arrivalTime: schArrTime,
      dayType: 'Weekday',
      frequency: `Every ${route.frequencyMinutes}m`,
      status: 'On Time',
      varianceMinutes: 0,
      onTimeRate: 98.0,
      platformNo: schPlatform
    });

    setScheduleModalOpen(false);
    showSuccess(`New timetable trip scheduled for Line ${route.code}! Synchronized with passenger timetables.`);
  };

  // 4. FLEET DISPATCH ASSIGNMENT STATE
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetVehId, setTargetVehId] = useState('');
  const [assignRouteId, setAssignRouteId] = useState('');
  const [assignDriverId, setAssignDriverId] = useState('');

  const openAssignModal = (veh: TransitVehicle) => {
    setTargetVehId(veh.id);
    setAssignRouteId(veh.assignedRouteId || routes[0]?.id || '');
    setAssignDriverId(veh.assignedDriverId || '');
    setAssignModalOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVehId) return;

    const result = assignVehicle(targetVehId, assignRouteId || null, assignDriverId || null);
    if (result.success) {
      showSuccess('Vehicle dispatched and driver assigned successfully!');
      setAssignModalOpen(false);
    } else {
      showError(result.message || 'Failed to dispatch vehicle.');
    }
  };

  // 5. DELAY INCIDENT MODAL
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [delayRouteId, setDelayRouteId] = useState(routes[0]?.id || '');
  const [delayVehId, setDelayVehId] = useState(vehicles[0]?.id || '');
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayCause, setDelayCause] = useState<DelayCause>('Traffic Congestion');
  const [delayAction, setDelayAction] = useState('');

  // Resolve delay modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolvingDelayId, setResolvingDelayId] = useState<string | null>(null);
  const [resolveActionNote, setResolveActionNote] = useState('');

  const handleCreateDelay = (e: React.FormEvent) => {
    e.preventDefault();
    const route = routes.find(r => r.id === delayRouteId);
    const veh = vehicles.find(v => v.id === delayVehId);
    if (!route) return;

    reportDelay({
      routeId: route.id,
      routeCode: route.code,
      routeName: route.name,
      vehicleId: veh?.regNumber,
      delayMinutes: Number(delayMinutes),
      cause: delayCause,
      affectedStops: route.stops.map(s => s.code),
      reportedByRole: 'Transport Operator',
      reportedByName: 'S. Rajalingam (Regional Manager)',
      estimatedResolutionTime: 'Next 30 mins IST',
      actionTaken: delayAction || `Operator logged ${delayCause} detour`,
      severity: delayMinutes > 15 ? 'High' : delayMinutes > 5 ? 'Medium' : 'Low'
    });

    setDelayAction('');
    setDelayModalOpen(false);
    showSuccess(`Service Delay Alert broadcasted! Affected passengers and driver notified.`);
  };

  const handleOpenResolve = (id: string) => {
    setResolvingDelayId(id);
    setResolveActionNote('');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingDelayId) return;

    resolveDelay(resolvingDelayId, resolveActionNote || 'Normal service restored by Dispatch.');
    setResolveModalOpen(false);
    setResolvingDelayId(null);
    showSuccess('Incident resolved! Active alert removed from passenger portal and maps.');
  };

  // 6. FEEDBACK RESPONSE STATE
  const [respondingFbId, setRespondingFbId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const handleOpenRespond = (id: string) => {
    setRespondingFbId(id);
    setResponseText('');
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingFbId || !responseText.trim()) return;

    respondToFeedback(respondingFbId, responseText.trim());
    setRespondingFbId(null);
    setResponseText('');
    showSuccess('Official redressal response submitted! Now visible to the commuter.');
  };

  const drivers = users.filter(u => u.role === 'Driver');
  const activeVehicles = vehicles.filter(v => v.status === 'In Service');
  const maintenanceVehicles = vehicles.filter(v => v.status === 'Maintenance');
  const activeDelays = delays.filter(d => d.status === 'Active');
  const pendingFeedbacks = feedbacks.filter(f => f.status === 'Pending');

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Operations Header Bar */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Transport Operations &amp; Dispatch Console
            </h1>
            <Badge variant="blue" size="sm">Regional Manager Clearance</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Warangal &amp; Telangana State Road Transport Corporation &bull; Central Control Hub
          </p>
        </div>

        {/* Live Operational Counters Strip */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 self-start md:self-auto font-mono">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Active Buses</span>
            <strong className="text-emerald-700">{activeVehicles.length} of {vehicles.length}</strong>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Maintenance</span>
            <strong className="text-purple-700">{maintenanceVehicles.length} Units</strong>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Active Alerts</span>
            <strong className={activeDelays.length > 0 ? 'text-amber-700' : 'text-slate-600'}>
              {activeDelays.length}
            </strong>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Pending Grievances</span>
            <strong className={pendingFeedbacks.length > 0 ? 'text-blue-700' : 'text-slate-600'}>
              {pendingFeedbacks.length}
            </strong>
          </div>
        </div>
      </div>

      {/* Real-time Notifications */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {errorNotification && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 text-xs flex items-center gap-2 animate-fade-in font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorNotification}</span>
        </div>
      )}

      {/* Main Operational Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-3.5 py-2 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'routes'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Corridors &amp; Routes ({routes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-3.5 py-2 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'fleet'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Fleet Dispatch &amp; Maintenance ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-3.5 py-2 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'schedules'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Timetable Scheduling ({schedules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stops')}
          className={`px-3.5 py-2 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'stops'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Transit Stations ({stops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('delays')}
          className={`px-3.5 py-2 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'delays'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Incident &amp; Delays ({activeDelays.length} active)</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-3.5 py-2 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'feedback'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Passenger Grievance Redressal ({pendingFeedbacks.length} pending)</span>
        </button>
      </div>

      {/* TAB 1: CORRIDORS & ROUTES */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Telangana Regional Corridors</h2>
              <p className="text-xs text-slate-500">
                Configure route pricing, operating hours, and toggle live availability on passenger search.
              </p>
            </div>
            <button
              onClick={openCreateRoute}
              className="px-3.5 py-2 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Corridor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map(route => (
              <div
                key={route.id}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-subtle space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: route.color }} />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-9 h-9 rounded text-white font-extrabold text-sm flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.code}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{route.name}</h3>
                      {route.teluguName && (
                        <p className="text-[11px] text-[#0d6e52] font-semibold">{route.teluguName}</p>
                      )}
                      <p className="text-[11px] text-slate-500 mt-0.5">{route.mode} &bull; {route.stops.length} Stations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit button */}
                    <button
                      onClick={() => openEditRoute(route)}
                      className="p-1.5 rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Route Specifications"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Publish Toggle Button */}
                    <button
                      onClick={() => togglePublishRoute(route.id)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        route.isPublished
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title={route.isPublished ? 'Route is active in passenger searches' : 'Draft: Hidden from passenger searches'}
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{route.isPublished ? 'Published' : 'Draft / Hidden'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {route.description}
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Frequency</span>
                    <strong className="text-slate-800">{route.frequencyMinutes}m</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Fare</span>
                    <strong className="text-emerald-700 font-bold">₹{route.fare.toFixed(0)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Distance</span>
                    <strong className="text-slate-800">{route.totalDistanceKm} km</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Hours: <strong className="text-slate-700">{route.operatingHours}</strong></span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {route.stops.map(s => s.code).join(' → ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FLEET DISPATCH & MAINTENANCE MATRIX */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Fleet Dispatch &amp; Maintenance Matrix</h2>
              <p className="text-xs text-slate-500">
                Assign routes and drivers. Dispatch or ground vehicles for maintenance.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Total Fleet: <strong>{vehicles.length}</strong> &bull; Active: <strong className="text-emerald-700">{activeVehicles.length}</strong>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Vehicle Plate</th>
                    <th className="py-2.5 px-3">Model / Mode</th>
                    <th className="py-2.5 px-3">Assigned Route</th>
                    <th className="py-2.5 px-3">Assigned Driver</th>
                    <th className="py-2.5 px-3">Telemetry / Speed</th>
                    <th className="py-2.5 px-3">Depot</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vehicles.map(veh => {
                    const assignedRoute = routes.find(r => r.id === veh.assignedRouteId);
                    const isMaint = veh.status === 'Maintenance';

                    return (
                      <tr key={veh.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {veh.regNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{veh.model}</div>
                          <span className="text-[10.5px] text-slate-400">{veh.mode}</span>
                        </td>
                        <td className="py-3 px-3">
                          {assignedRoute ? (
                            <span className="inline-flex items-center gap-1 font-bold text-xs" style={{ color: assignedRoute.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: assignedRoute.color }} />
                              Line {assignedRoute.code}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {veh.assignedDriverName ? (
                            <span className="font-medium text-slate-900">{veh.assignedDriverName}</span>
                          ) : (
                            <span className="text-slate-400 italic">No driver assigned</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {veh.status === 'In Service' ? (
                            <span className="text-emerald-700 font-bold">{veh.speedKmH} km/h (Moving)</span>
                          ) : (
                            <span className="text-slate-400">0 km/h (Stationary)</span>
                          )}
                          <div className="text-[10px] text-slate-400">{veh.batteryOrFuelPercent}% fuel</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                          {veh.depot}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              veh.status === 'In Service'
                                ? 'bg-emerald-100 text-emerald-800'
                                : veh.status === 'Delayed'
                                ? 'bg-amber-100 text-amber-800'
                                : veh.status === 'Maintenance'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {veh.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Assign button */}
                            <button
                              onClick={() => openAssignModal(veh)}
                              disabled={isMaint}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                                isMaint
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                              title={isMaint ? 'Clear maintenance before dispatching' : 'Assign route and driver'}
                            >
                              Dispatch
                            </button>

                            {/* Maintenance Toggle button */}
                            <button
                              onClick={() => setVehicleMaintenance(veh.id, !isMaint)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                                isMaint
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100'
                              }`}
                            >
                              {isMaint ? 'Clear Maint.' : 'Maintenance'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER TIMETABLE SCHEDULING */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Master Timetable Scheduling</h2>
              <p className="text-xs text-slate-500">
                Scheduled departure and arrival times (IST). Changes update passenger timetables and trip trackers.
              </p>
            </div>
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="px-3.5 py-2 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Trip</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Trip ID</th>
                    <th className="py-2.5 px-3">Corridor</th>
                    <th className="py-2.5 px-3">Bus Plate</th>
                    <th className="py-2.5 px-3">Assigned Driver</th>
                    <th className="py-2.5 px-3">Sched. Dep (IST)</th>
                    <th className="py-2.5 px-3">Sched. Arr (IST)</th>
                    <th className="py-2.5 px-3">Trip Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {schedules.map(sch => (
                    <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {sch.tripId}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800">
                          Line {sch.routeCode}: {sch.routeName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {sch.vehicleId}
                      </td>
                      <td className="py-2.5 px-3 font-medium">
                        {sch.driverName}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        {sch.departureTime}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {sch.arrivalTime}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            sch.status === 'On Time'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sch.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sch.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => deleteSchedule(sch.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove trip schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSIT STATIONS */}
      {activeTab === 'stops' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Telangana Transit Stations Directory</h2>
              <p className="text-xs text-slate-500">
                Station GPS coordinates, stop amenities, and served corridors across Telangana.
              </p>
            </div>
            <button
              onClick={() => setStopModalOpen(true)}
              className="px-3.5 py-2 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Station Stop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stops.map(stop => (
              <div key={stop.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {stop.code}
                  </span>
                  <span className="text-[10.5px] text-slate-400 font-mono">{stop.zone}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0d6e52] shrink-0" />
                    <span>{stop.name}</span>
                  </h3>
                  {stop.teluguName && (
                    <p className="text-[11px] text-[#0d6e52] font-semibold">{stop.teluguName}</p>
                  )}
                </div>
                <div className="font-mono text-[10.5px] text-slate-500">
                  GPS: {stop.location.lat.toFixed(4)}° N, {stop.location.lng.toFixed(4)}° E
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {stop.amenities.map(a => (
                    <span key={a} className="text-[9.5px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INCIDENT & DELAY MANAGEMENT */}
      {activeTab === 'delays' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Traffic Incidents &amp; Service Delays</h2>
              <p className="text-xs text-slate-500">
                Broadcast traffic delays to all passengers and drivers. Resolving an incident immediately removes the alert.
              </p>
            </div>
            <button
              onClick={() => setDelayModalOpen(true)}
              className="px-3.5 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Broadcast Road Delay</span>
            </button>
          </div>

          <div className="space-y-3">
            {delays.map(delay => {
              const isResolved = delay.status === 'Resolved';
              return (
                <div
                  key={delay.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isResolved ? 'bg-white border-slate-200' : 'bg-amber-50/70 border-amber-300 shadow-subtle'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-mono">
                        Line {delay.routeCode}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{delay.routeName}</h3>
                      <Badge variant={isResolved ? 'green' : 'red'} size="xs">
                        {isResolved ? 'Resolved' : `+${delay.delayMinutes}m Delayed`}
                      </Badge>
                    </div>

                    {!isResolved && (
                      <button
                        onClick={() => handleOpenResolve(delay.id)}
                        className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve Incident</span>
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <div>
                      Cause: <strong className="text-slate-900">{delay.cause}</strong> &bull; Reported At: <strong className="font-mono">{delay.reportedAt} IST</strong> by {delay.reportedByName}
                    </div>
                    {delay.actionTaken && (
                      <div className="text-slate-600 bg-white/70 p-2 rounded border border-slate-200 font-mono text-[11px]">
                        Action / Advisory: <strong>{delay.actionTaken}</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: PASSENGER GRIEVANCE REDRESSAL */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Commuter Feedback &amp; Grievances</h2>
              <p className="text-xs text-slate-500">
                Review passenger reviews and provide official authority redressal responses.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Pending Action: <strong className="text-blue-700">{pendingFeedbacks.length}</strong> &bull; Total: <strong>{feedbacks.length}</strong>
            </div>
          </div>

          <div className="space-y-3">
            {feedbacks.map(fb => (
              <div
                key={fb.id}
                className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">
                      Line {fb.routeCode}
                    </span>
                    <strong className="text-slate-900 text-sm">{fb.passengerName}</strong>
                    <span className="text-amber-500 font-bold text-xs">{'★'.repeat(fb.rating)}</span>
                    <Badge variant={fb.status === 'Pending' ? 'amber' : 'green'} size="xs">
                      {fb.status}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{fb.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                  "{fb.comment}"
                </p>

                {/* If official response exists */}
                {fb.adminResponse ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-emerald-800 uppercase font-mono">Official Authority Redressal:</strong>
                      <span>{fb.adminResponse}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-end">
                    {respondingFbId === fb.id ? (
                      <form onSubmit={handleSubmitResponse} className="w-full space-y-2 pt-2 border-t border-slate-100">
                        <textarea
                          rows={2}
                          required
                          value={responseText}
                          onChange={e => setResponseText(e.target.value)}
                          placeholder="Type official TGSRTC redressal response to this passenger..."
                          className="w-full p-2 text-xs border border-slate-300 rounded bg-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setRespondingFbId(null)}
                            className="px-3 py-1 rounded text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Submit Official Response</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => handleOpenRespond(fb.id)}
                        className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-[#0d6e52]" />
                        <span>Provide Official Redressal</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ROUTE */}
      <Modal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        title={editingRouteId ? `Edit Corridor: Line ${routeCode}` : 'Create New Transit Corridor'}
        subtitle="Route specifications immediately propagate to passenger route search, timetables, and maps."
      >
        <form onSubmit={handleSaveRoute} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Route Line Code</label>
              <input
                type="text"
                required
                placeholder="e.g. 601"
                value={routeCode}
                onChange={e => setRouteCode(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transport Mode</label>
              <select
                value={routeMode}
                onChange={e => setRouteMode(e.target.value as TransportMode)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-semibold"
              >
                <option value="Metro Express">Metro Express</option>
                <option value="City Ordinary">City Ordinary</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Super Luxury">Super Luxury</option>
                <option value="Electric EV">Electric EV</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Route Name (English)</label>
            <input
              type="text"
              required
              placeholder="e.g. Warangal CBS ⇄ Kazipet Junction"
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Telugu Designation (తెలుగు)</label>
            <input
              type="text"
              placeholder="e.g. వరంగల్ సిటీ బస్ స్టేషన్ - కాజీపేట జంక్షన్"
              value={routeTeluguName}
              onChange={e => setRouteTeluguName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Fare (₹)</label>
              <input
                type="number"
                min="5"
                max="500"
                required
                value={routeFare}
                onChange={e => setRouteFare(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Frequency (Mins)</label>
              <input
                type="number"
                min="5"
                max="60"
                required
                value={routeFreq}
                onChange={e => setRouteFreq(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Map Line Color</label>
              <input
                type="color"
                value={routeColor}
                onChange={e => setRouteColor(e.target.value)}
                className="w-full h-8 rounded border border-slate-300 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hours</label>
            <input
              type="text"
              required
              placeholder="05:30 AM - 10:30 PM IST"
              value={routeHours}
              onChange={e => setRouteHours(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Route Description</label>
            <textarea
              rows={2}
              value={routeDesc}
              onChange={e => setRouteDesc(e.target.value)}
              placeholder="Important landmark connections, highway routes, transfer hubs..."
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRouteModalOpen(false)}
              className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white text-xs font-bold cursor-pointer"
            >
              {editingRouteId ? 'Save Route Changes' : 'Create & Publish Route'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ASSIGN VEHICLE & DRIVER */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Dispatch Vehicle & Driver Allocation"
        subtitle="Assign this transit vehicle to an operational corridor and assign a licensed driver."
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Route Corridor</label>
            <select
              value={assignRouteId}
              onChange={e => setAssignRouteId(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            >
              <option value="">-- Unassigned (Stationary at Depot) --</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  Line {r.code} - {r.name} ({r.mode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Staff Driver</label>
            <select
              value={assignDriverId}
              onChange={e => setAssignDriverId(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            >
              <option value="">-- No Driver Assigned --</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.badgeNumber || 'Driver'})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 leading-relaxed">
            <strong>Dispatch Rule:</strong> When both a route and a driver are assigned, the vehicle becomes available for the driver to start their shift. If unassigned, the bus remains stationary at the depot.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white text-xs font-bold cursor-pointer"
            >
              Confirm Dispatch Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: SCHEDULE NEW TRIP */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule New Corridor Trip"
        subtitle="Schedules departure and arrival times (IST). Appears in passenger timetables."
      >
        <form onSubmit={handleSaveSchedule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Corridor Route</label>
            <select
              value={schRouteId}
              onChange={e => setSchRouteId(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            >
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  Line {r.code} - {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bus Unit</label>
              <select
                value={schVehId}
                onChange={e => setSchVehId(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              >
                {vehicles.filter(v => v.status !== 'Maintenance').map(v => (
                  <option key={v.id} value={v.regNumber}>
                    {v.regNumber} ({v.model})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Staff Driver</label>
              <select
                value={schDriverId}
                onChange={e => setSchDriverId(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
              >
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Departure (IST)</label>
              <input
                type="text"
                required
                value={schDepTime}
                onChange={e => setSchDepTime(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Arrival (IST)</label>
              <input
                type="text"
                required
                value={schArrTime}
                onChange={e => setSchArrTime(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Platform / Bay</label>
              <input
                type="text"
                value={schPlatform}
                onChange={e => setSchPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white text-xs font-bold cursor-pointer"
            >
              Publish to Master Timetable
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD TRANSIT STOP */}
      <Modal
        isOpen={stopModalOpen}
        onClose={() => setStopModalOpen(false)}
        title="Add Transit Station Stop"
        subtitle="Station coordinates will appear on passenger maps and stop selector."
      >
        <form onSubmit={handleSaveStop} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Station Code</label>
              <input
                type="text"
                required
                placeholder="e.g. HNK-DEPOT"
                value={stopCode}
                onChange={e => setStopCode(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corridor Zone</label>
              <input
                type="text"
                required
                value={stopZone}
                onChange={e => setStopZone(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Station Name (English)</label>
            <input
              type="text"
              required
              placeholder="e.g. Kakatiya University South Gate"
              value={stopName}
              onChange={e => setStopName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Telugu Name (తెలుగు)</label>
            <input
              type="text"
              placeholder="e.g. కాకతీయ యూనివర్సిటీ సౌత్ గేట్"
              value={stopTelugu}
              onChange={e => setStopTelugu(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Latitude (° N)</label>
              <input
                type="text"
                required
                value={stopLat}
                onChange={e => setStopLat(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Longitude (° E)</label>
              <input
                type="text"
                required
                value={stopLng}
                onChange={e => setStopLng(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStopModalOpen(false)}
              className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white text-xs font-bold cursor-pointer"
            >
              Save Transit Station
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: BROADCAST DELAY INCIDENT */}
      <Modal
        isOpen={delayModalOpen}
        onClose={() => setDelayModalOpen(false)}
        title="Broadcast Road Delay &amp; Service Detour"
        subtitle="This notice propagates immediately to passenger maps, alerts, and driver cockpits."
      >
        <form onSubmit={handleCreateDelay} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Affected Corridor</label>
              <select
                value={delayRouteId}
                onChange={e => setDelayRouteId(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    Line {r.code} - {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Affected Bus (Optional)</label>
              <select
                value={delayVehId}
                onChange={e => setDelayVehId(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono"
              >
                <option value="">All buses on corridor</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.regNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delay Duration (Mins)</label>
              <input
                type="number"
                min="5"
                max="90"
                value={delayMinutes}
                onChange={e => setDelayMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Root Cause</label>
              <select
                value={delayCause}
                onChange={e => setDelayCause(e.target.value as DelayCause)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
              >
                <option value="Traffic Congestion">Traffic Congestion</option>
                <option value="Railway Gate Closure">Railway Gate Closure</option>
                <option value="Road Construction">Road Construction</option>
                <option value="Weather / Heavy Rain">Weather / Heavy Rain</option>
                <option value="Mechanical Issue">Mechanical Issue</option>
                <option value="Festival / Procession Detour">Festival Detour</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Passenger Advisory Note</label>
            <textarea
              rows={2}
              required
              value={delayAction}
              onChange={e => setDelayAction(e.target.value)}
              placeholder="e.g. Flyover road work near Subedari. Standby express bus deployed."
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDelayModalOpen(false)}
              className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
            >
              Broadcast Delay Alert Now
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: RESOLVE INCIDENT */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Active Service Incident"
        subtitle="Marking this incident resolved will remove it from active alerts across all portals."
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mitigation / Resolution Note</label>
            <textarea
              rows={3}
              required
              value={resolveActionNote}
              onChange={e => setResolveActionNote(e.target.value)}
              placeholder="e.g. Traffic cleared at Kazipet junction. Bus resumed normal operating schedule."
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
            >
              Confirm Incident Resolution
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
