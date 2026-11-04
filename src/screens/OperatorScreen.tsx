import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  TransitRoute,
  TransitStop,
  TransitVehicle,
  TransportMode,
  DelayCause,
  VehicleStatus
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
  Radio,
  Clock,
  Layers,
  Wrench,
  Check,
  Send
} from 'lucide-react';

export const OperatorScreen: React.FC = () => {
  const {
    routes,
    stops,
    vehicles,
    delays,
    users,
    addRoute,
    updateRoute,
    togglePublishRoute,
    addStop,
    updateVehicle,
    reportDelay,
    resolveDelay
  } = useTransit();

  const [activeTab, setActiveTab] = useState<'routes' | 'fleet' | 'delays' | 'stops'>('routes');

  // Route modal
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [routeCode, setRouteCode] = useState('');
  const [routeName, setRouteName] = useState('');
  const [routeMode, setRouteMode] = useState<TransportMode>('Bus');
  const [routeColor, setRouteColor] = useState('#006bc9');
  const [routeHours, setRouteHours] = useState('06:00 AM - 11:00 PM');
  const [routeFreq, setRouteFreq] = useState(12);
  const [routeFare, setRouteFare] = useState(2.75);

  // Stop modal
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [stopCode, setStopCode] = useState('');
  const [stopName, setStopName] = useState('');
  const [stopLat, setStopLat] = useState('37.7800');
  const [stopLng, setStopLng] = useState('-122.4100');
  const [stopZone, setStopZone] = useState('Zone 1 - Downtown Core');

  // Vehicle modal
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [vehReg, setVehReg] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehMode, setVehMode] = useState<TransportMode>('Bus');
  const [vehRouteId, setVehRouteId] = useState(routes[0]?.id || '');
  const [vehDriverId, setVehDriverId] = useState('');

  // Delay Incident modal
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [delayRouteId, setDelayRouteId] = useState(routes[0]?.id || '');
  const [delayMinutes, setDelayMinutes] = useState(8);
  const [delayCause, setDelayCause] = useState<DelayCause>('Traffic Congestion');
  const [delayAction, setDelayAction] = useState('');

  // Resolve delay note
  const [resolveNote, setResolveNote] = useState<{ [id: string]: string }>({});

  const drivers = users.filter(u => u.role === 'Driver');

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeCode || !routeName) return;

    addRoute({
      code: routeCode,
      name: routeName,
      mode: routeMode,
      color: routeColor,
      description: `Corridor service connecting major central districts via ${routeName}.`,
      operatingHours: routeHours,
      frequencyMinutes: Number(routeFreq),
      isPublished: true,
      stops: [stops[0], stops[1]],
      waypoints: [stops[0].location, stops[1].location],
      fare: Number(routeFare),
      totalDistanceKm: 6.5,
      averageDurationMinutes: 24
    });

    setRouteCode('');
    setRouteName('');
    setRouteModalOpen(false);
  };

  const handleSaveStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stopName || !stopCode) return;

    addStop({
      code: stopCode,
      name: stopName,
      location: { lat: parseFloat(stopLat), lng: parseFloat(stopLng) },
      zone: stopZone,
      amenities: ['Shelter', 'Digital Display', 'Wheelchair Access'],
      routesServed: [routes[0]?.id || 'route-101']
    });

    setStopCode('');
    setStopName('');
    setStopModalOpen(false);
  };

  const handleCreateDelay = (e: React.FormEvent) => {
    e.preventDefault();
    const route = routes.find(r => r.id === delayRouteId);
    if (!route) return;

    reportDelay({
      routeId: route.id,
      routeCode: route.code,
      routeName: route.name,
      delayMinutes: Number(delayMinutes),
      cause: delayCause,
      affectedStops: route.stops.map(s => s.code),
      reportedByRole: 'Transport Operator',
      reportedByName: 'Marcus Vance (Dispatch)',
      estimatedResolutionTime: 'Next 45 mins',
      actionTaken: delayAction || 'Operator dispatched standby unit.',
      severity: delayMinutes > 15 ? 'High' : delayMinutes > 5 ? 'Medium' : 'Low'
    });

    setDelayAction('');
    setDelayModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Transport Operator Dispatch &amp; Route Management
            </h1>
            <Badge variant="blue">Operator Console</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure routes, stops, timetable publication, vehicle fleet allocation, and service delays.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'routes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-transit-600" />
            <span>Routes</span>
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'fleet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fleet</span>
          </button>
          <button
            onClick={() => setActiveTab('stops')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'stops' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Stops</span>
          </button>
          <button
            onClick={() => setActiveTab('delays')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'delays' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Delays</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ROUTES MANAGEMENT */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Active Transit Corridors &amp; Timetables</h3>
              <p className="text-xs text-slate-500">Publish routes to the public portal or edit operational frequencies</p>
            </div>
            <button
              onClick={() => setRouteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-transit-600 hover:bg-transit-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Route</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map(route => (
              <div
                key={route.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: route.color }}
                />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-9 h-9 rounded-xl text-white font-extrabold text-sm flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.code}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{route.name}</h4>
                      <p className="text-[11px] text-slate-500">{route.mode} &bull; {route.stops.length} Stops</p>
                    </div>
                  </div>

                  {/* Publish Toggle Button */}
                  <button
                    onClick={() => togglePublishRoute(route.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      route.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{route.isPublished ? 'Published' : 'Draft / Unpublished'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {route.description}
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Frequency</span>
                    <strong className="text-slate-800">{route.frequencyMinutes} mins</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Fare</span>
                    <strong className="text-emerald-600">${route.fare.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Distance</span>
                    <strong className="text-slate-800">{route.totalDistanceKm} km</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Operating: <strong className="text-slate-700">{route.operatingHours}</strong></span>
                  <span className="text-transit-600 font-semibold cursor-pointer hover:underline">
                    {route.stops.map(s => s.code).join(' &rarr; ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FLEET MANAGEMENT */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Transit Fleet Inventory &amp; Telemetry Status</h3>
              <p className="text-xs text-slate-500">Monitor active vehicles, assign drivers, or toggle maintenance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Total: <strong>{vehicles.length} Units</strong></span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Vehicle ID</th>
                    <th className="py-3 px-3">Model &amp; Mode</th>
                    <th className="py-3 px-3">Assigned Route</th>
                    <th className="py-3 px-3">Assigned Driver</th>
                    <th className="py-3 px-3">Speed / GPS</th>
                    <th className="py-3 px-3">Battery / Fuel</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vehicles.map(veh => {
                    const route = routes.find(r => r.id === veh.assignedRouteId);
                    return (
                      <tr key={veh.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {veh.regNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{veh.model}</div>
                          <span className="text-[10px] text-slate-400">{veh.mode}</span>
                        </td>
                        <td className="py-3 px-3">
                          {route ? (
                            <span className="inline-flex items-center gap-1 font-bold text-xs" style={{ color: route.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }} />
                              Line {route.code}
                            </span>
                          ) : (
                            <span className="text-slate-400">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {veh.assignedDriverName || (
                            <span className="text-slate-400 italic">No driver assigned</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {veh.status === 'In Service' ? (
                            <span className="text-emerald-700 font-bold">{veh.speedKmH} km/h (Active)</span>
                          ) : (
                            <span className="text-slate-400">0 km/h</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  veh.batteryOrFuelPercent > 50 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${veh.batteryOrFuelPercent}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold">{veh.batteryOrFuelPercent}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            veh.status === 'In Service' ? 'bg-emerald-100 text-emerald-800' :
                            veh.status === 'Delayed' ? 'bg-rose-100 text-rose-800' :
                            veh.status === 'Maintenance' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {veh.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              const nextStatus: VehicleStatus =
                                veh.status === 'Maintenance' ? 'In Service' : 'Maintenance';
                              updateVehicle({
                                ...veh,
                                status: nextStatus,
                                isSimulating: nextStatus === 'In Service'
                              });
                            }}
                            className="px-2 py-1 rounded text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            {veh.status === 'Maintenance' ? 'Set Active' : 'Send to Maintenance'}
                          </button>
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

      {/* TAB 3: STOPS MANAGEMENT */}
      {activeTab === 'stops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Station &amp; Transit Stop Directory</h3>
              <p className="text-xs text-slate-500">Configure stop GPS geo-points, accessibility amenities, and served corridors</p>
            </div>
            <button
              onClick={() => setStopModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Transit Stop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stops.map(stop => (
              <div key={stop.id} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {stop.code}
                  </span>
                  <span className="text-[10px] text-slate-400">{stop.zone}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-transit-600 shrink-0" />
                  <span>{stop.name}</span>
                </h4>
                <div className="font-mono text-[11px] text-slate-500">
                  GPS: {stop.location.lat.toFixed(4)}, {stop.location.lng.toFixed(4)}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {stop.amenities.map(a => (
                    <span key={a} className="text-[9px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DELAYS & INCIDENTS MANAGER */}
      {activeTab === 'delays' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Active Service Delays &amp; Incident Dispatch</h3>
              <p className="text-xs text-slate-500">Post delay advisories, specify root causes, and notify commuters</p>
            </div>
            <button
              onClick={() => setDelayModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Issue Service Delay Alert</span>
            </button>
          </div>

          <div className="space-y-3">
            {delays.map(delay => {
              const isResolved = delay.status === 'Resolved';
              return (
                <div
                  key={delay.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isResolved ? 'bg-white border-slate-200' : 'bg-amber-50/70 border-amber-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-mono">
                        Route {delay.routeCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{delay.routeName}</h4>
                      <Badge variant={isResolved ? 'green' : 'red'}>
                        {isResolved ? 'Resolved' : `+${delay.delayMinutes}m Delayed`}
                      </Badge>
                    </div>

                    <span className="text-xs text-slate-500">
                      Reported at: <strong>{delay.reportedAt}</strong> by {delay.reportedByName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mb-2">
                    <strong>Cause:</strong> {delay.cause} &bull; <strong>Action / Detour:</strong> {delay.actionTaken}
                  </p>

                  {!isResolved && (
                    <div className="pt-2 border-t border-amber-200/80 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Resolution note (e.g. Cleared by traffic police, normal timetable resumed)"
                        value={resolveNote[delay.id] || ''}
                        onChange={e => setResolveNote({ ...resolveNote, [delay.id]: e.target.value })}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <button
                        onClick={() => {
                          resolveDelay(
                            delay.id,
                            resolveNote[delay.id] || 'Service returned to normal schedule.'
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create Route */}
      <Modal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        title="Create New Transit Corridor"
        subtitle="Define route specifications, transport mode, timetable frequency, and standard fare."
      >
        <form onSubmit={handleSaveRoute} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Route Code</label>
              <input
                type="text"
                required
                placeholder="e.g. 505"
                value={routeCode}
                onChange={e => setRouteCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transport Mode</label>
              <select
                value={routeMode}
                onChange={e => setRouteMode(e.target.value as TransportMode)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              >
                <option value="Bus">Bus</option>
                <option value="Tram">Tram</option>
                <option value="Express Shuttle">Express Shuttle</option>
                <option value="Metro Rail">Metro Rail</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Corridor Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Waterfront Maritime Express"
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Frequency (Mins)</label>
              <input
                type="number"
                value={routeFreq}
                onChange={e => setRouteFreq(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Single Fare ($)</label>
              <input
                type="number"
                step="0.25"
                value={routeFare}
                onChange={e => setRouteFare(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Color Theme</label>
              <input
                type="color"
                value={routeColor}
                onChange={e => setRouteColor(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRouteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-transit-600 hover:bg-transit-700 text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save &amp; Publish Route</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Transit Stop */}
      <Modal
        isOpen={stopModalOpen}
        onClose={() => setStopModalOpen(false)}
        title="Add Transit Station Stop"
        subtitle="Record geographic GPS coordinates, code, and passenger amenities."
      >
        <form onSubmit={handleSaveStop} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stop Code</label>
              <input
                type="text"
                required
                placeholder="ST-WF14"
                value={stopCode}
                onChange={e => setStopCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fare Zone</label>
              <input
                type="text"
                value={stopZone}
                onChange={e => setStopZone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Station / Stop Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Marina Green Boulevard"
              value={stopName}
              onChange={e => setStopName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
              <input
                type="text"
                value={stopLat}
                onChange={e => setStopLat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
              <input
                type="text"
                value={stopLng}
                onChange={e => setStopLng(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStopModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Stop</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Issue Service Delay */}
      <Modal
        isOpen={delayModalOpen}
        onClose={() => setDelayModalOpen(false)}
        title="Issue Official Service Delay Advisory"
        subtitle="Log an incident, delay impact, and mitigation measures."
      >
        <form onSubmit={handleCreateDelay} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Affected Route</label>
              <select
                value={delayRouteId}
                onChange={e => setDelayRouteId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    Line {r.code} - {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Delay (Minutes)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={delayMinutes}
                onChange={e => setDelayMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Cause</label>
            <select
              value={delayCause}
              onChange={e => setDelayCause(e.target.value as DelayCause)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            >
              <option value="Traffic Congestion">Traffic Congestion</option>
              <option value="Adverse Weather">Adverse Weather</option>
              <option value="Mechanical Issue">Mechanical Issue</option>
              <option value="Road Construction">Road Construction</option>
              <option value="Accident Clearance">Accident Clearance</option>
              <option value="Signal Failure">Signal Failure</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mitigation Action Taken</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Auxiliary shuttle deployed; transit priority signals engaged."
              value={delayAction}
              onChange={e => setDelayAction(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDelayModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Delay Notice</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
