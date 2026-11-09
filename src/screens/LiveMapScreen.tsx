import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { TransitVehicle, TransitStop } from '../types';
import {
  Bus,
  MapPin,
  Clock,
  Compass,
  Users,
  BatteryCharging,
  Wifi,
  Wind,
  Navigation,
  Layers,
  ChevronRight,
  ShieldCheck,
  Search,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  IndianRupee,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const LiveMapScreen: React.FC<{
  onNavigateToScreen?: (screen: string) => void;
}> = ({ onNavigateToScreen }) => {
  const {
    currentUser,
    routes,
    stops,
    vehicles,
    delays,
    selectedRouteId,
    setSelectedRouteId,
    selectedVehicleId,
    setSelectedVehicleId,
    isSimulationRunning
  } = useTransit();

  const [selectedStop, setSelectedStop] = useState<TransitStop | null>(null);

  // Point-to-Point Bus Route Finder state (Passenger core requirement)
  const [sourceStopId, setSourceStopId] = useState<string>('stop-kzp'); // Kazipet
  const [destStopId, setDestStopId] = useState<string>('stop-wgl'); // Warangal CBS
  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const [fleetListFilter, setFleetListFilter] = useState<'All' | 'In Service' | 'Delayed' | 'Depot'>('All');

  // Filter routes: Passengers only see published corridors
  const displayRoutes = currentUser.role === 'Passenger'
    ? routes.filter(r => r.isPublished !== false)
    : routes;

  const activeVehicles = vehicles.filter(v => v.status === 'In Service');
  const delayedVehicles = vehicles.filter(v => v.delayMinutes > 3 || v.status === 'Delayed');
  const currentSelectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || activeVehicles[0];
  const activeRoute = displayRoutes.find(r => r.id === selectedRouteId);

  const displayedFleetList = vehicles.filter(v => {
    if (fleetListFilter === 'All') return true;
    if (fleetListFilter === 'In Service') return v.status === 'In Service';
    if (fleetListFilter === 'Delayed') return v.delayMinutes > 3 || v.status === 'Delayed';
    if (fleetListFilter === 'Depot') return v.status === 'Idle / Depot' || v.status === 'Maintenance' || v.status === 'Off Duty';
    return true;
  });

  const sourceStop = stops.find(s => s.id === sourceStopId);
  const destStop = stops.find(s => s.id === destStopId);

  // Find matching routes connecting source and destination stops
  const matchingRoutes = displayRoutes.filter(r => {
    const hasSource = r.stops.some(s => s.id === sourceStopId);
    const hasDest = r.stops.some(s => s.id === destStopId);
    return hasSource && hasDest;
  });

  const getOccupancyBadge = (occupancy: TransitVehicle['occupancy']) => {
    switch (occupancy) {
      case 'Empty':
      case 'Low':
        return <Badge variant="green">{occupancy} Seating Available</Badge>;
      case 'Moderate':
        return <Badge variant="blue">{occupancy} Crowding</Badge>;
      case 'Crowded':
        return <Badge variant="amber">{occupancy} Standing Only</Badge>;
      case 'Full':
        return <Badge variant="red">Bus Full</Badge>;
      default:
        return <Badge variant="gray">{occupancy}</Badge>;
    }
  };

  const handleSwapStops = () => {
    const temp = sourceStopId;
    setSourceStopId(destStopId);
    setDestStopId(temp);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Regional Header Bar */}
      <div className="bg-white rounded-lg p-5 border border-slate-300/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentUser.role === 'Passenger'
                ? 'Passenger Bus Finder & Live Telangana GPS Map'
                : currentUser.role === 'Driver'
                ? 'Driver Route Radar & Real-Time Navigation'
                : 'Warangal & Telangana Fleet Tracking & GPS Telemetry'}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Telemetry (IST)
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {currentUser.role === 'Passenger'
              ? 'Find buses between any stops in Telangana, view live ETA arrival predictions, and inspect intermediate stops.'
              : currentUser.role === 'Driver'
              ? 'Active navigation display tracking your bus location and progression between stops.'
              : 'Real-time GPS tracking for TGSRTC buses operating in Warangal, Hanamkonda, Kazipet, Hyderabad, Karimnagar & Khammam.'}
          </p>
        </div>

        {/* Quick actions or metrics */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {currentUser.role === 'Passenger' && onNavigateToScreen && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToScreen('routes')}
                className="px-3 py-1.5 rounded text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 cursor-pointer"
              >
                Timetables &amp; Fares (₹) &rarr;
              </button>
              <button
                onClick={() => onNavigateToScreen('feedback')}
                className="px-3 py-1.5 rounded text-xs font-bold bg-[#0d6e52] hover:bg-[#0b5c44] text-white cursor-pointer"
              >
                Submit Feedback / Grievance
              </button>
            </div>
          )}

          {currentUser.role === 'Driver' && onNavigateToScreen && (
            <button
              onClick={() => onNavigateToScreen('driver')}
              className="px-3 py-1.5 rounded text-xs font-bold bg-[#0d6e52] hover:bg-[#0b5c44] text-white cursor-pointer"
            >
              &larr; Open Driver Cockpit
            </button>
          )}

          {currentUser.role !== 'Passenger' && currentUser.role !== 'Driver' && (
            <div className="flex items-center gap-3 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-semibold">Active Fleet</div>
                <div className="text-sm font-bold text-slate-900">{activeVehicles.length} of {vehicles.length} Buses</div>
              </div>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-semibold">Telemetry Engine</div>
                <div className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {isSimulationRunning ? 'Transmitting' : 'Paused'}
                </div>
              </div>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-semibold">On-Time Index</div>
                <div className="text-sm font-bold text-[#0d6e52]">96.8% (IST)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Passenger Point-to-Point Route Search Box */}
      <div className="bg-[#0f223d] text-white rounded-lg p-4 border border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Passenger Bus Route Finder (Point-to-Point)
          </span>
          <span className="text-[11px] text-slate-300">
            Search buses between any two stops in Telangana
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Source Stop */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Boarding Stop (Source)
            </label>
            <select
              value={sourceStopId}
              onChange={e => setSourceStopId(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-white text-xs focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
            >
              {stops.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) {s.teluguName ? `- ${s.teluguName}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pb-1">
            <button
              onClick={handleSwapStops}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-colors"
              title="Swap Origin and Destination"
            >
              <SlidersHorizontal className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* Destination Stop */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Alighting Stop (Destination)
            </label>
            <select
              value={destStopId}
              onChange={e => setDestStopId(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-white text-xs focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
            >
              {stops.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) {s.teluguName ? `- ${s.teluguName}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-3">
            <button
              onClick={() => setHasSearched(true)}
              className="w-full py-2 px-3 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Available Buses</span>
            </button>
          </div>
        </div>

        {/* Search Results Drawer */}
        {hasSearched && (
          <div className="mt-3 pt-3 border-t border-slate-700/80">
            {matchingRoutes.length > 0 ? (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Found <strong>{matchingRoutes.length} direct corridor bus(es)</strong> between{' '}
                    <strong className="text-white">{sourceStop?.name}</strong> and{' '}
                    <strong className="text-white">{destStop?.name}</strong>:
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {matchingRoutes.map(route => {
                    const activeBusOnRoute = vehicles.find(
                      v => v.assignedRouteId === route.id && v.status === 'In Service'
                    );
                    const routeDelay = delays.find(
                      d => d.routeId === route.id && d.status === 'Active'
                    );

                    return (
                      <div
                        key={route.id}
                        className="bg-slate-900/90 rounded p-3 border border-slate-700 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="inline-flex items-center gap-1.5 font-bold text-xs">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: route.color }}
                              />
                              <span className="text-white">Line {route.code}: {route.name}</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
                              {route.mode}
                            </span>
                          </div>

                          {routeDelay && (
                            <div className="my-1.5 px-2 py-1 rounded bg-amber-950/80 border border-amber-600/50 text-[10.5px] text-amber-200 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>
                                <strong>Active Delay:</strong> +{routeDelay.delayMinutes}m ({routeDelay.cause})
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-300 my-1">
                            <span>Standard Fare: <strong className="text-emerald-400">₹{route.fare.toFixed(0)}</strong></span>
                            <span>Distance: <strong>{route.totalDistanceKm} km</strong></span>
                            <span>Frequency: <strong>Every {route.frequencyMinutes}m</strong></span>
                          </div>

                          {/* Intermediate stops list */}
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                            Stops: {route.stops.map(s => s.name.split(' ')[0]).join(' &rarr; ')}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[10.5px] text-slate-300">
                            {activeBusOnRoute ? (
                              <span className="text-emerald-400 font-semibold">
                                Live: {activeBusOnRoute.regNumber} ({activeBusOnRoute.speedKmH} km/h) &bull; ETA: ~4 mins
                              </span>
                            ) : (
                              <span className="text-slate-400">Next scheduled in {route.frequencyMinutes} mins</span>
                            )}
                          </span>

                          <button
                            onClick={() => {
                              setSelectedRouteId(route.id);
                              if (activeBusOnRoute) setSelectedVehicleId(activeBusOnRoute.id);
                            }}
                            className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                          >
                            Highlight on Map &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  No direct bus connects these specific stops. Transit transfer available at{' '}
                  <strong className="text-white">Hanamkonda Central Bus Station (HNK)</strong> or{' '}
                  <strong className="text-white">Warangal City Bus Station (CBS)</strong>.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Corridor Filter Tabs (Telangana Bus Lines) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedRouteId(null)}
          className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
            selectedRouteId === null
              ? 'bg-[#0f223d] text-white border-[#0f223d]'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          All Corridors ({displayRoutes.length})
        </button>

        {displayRoutes.map(route => {
          const isSelected = selectedRouteId === route.id;
          return (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-white shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              style={{
                borderColor: isSelected ? route.color : undefined,
                color: isSelected ? route.color : undefined
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: route.color }}
              />
              <span>Line {route.code}: {route.name}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                ₹{route.fare.toFixed(0)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Map (Left) + Bus Telemetry & Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Interactive Leaflet Map (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <LeafletMap
            selectedRouteId={selectedRouteId}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={veh => {
              setSelectedVehicleId(veh.id);
              if (veh.assignedRouteId) setSelectedRouteId(veh.assignedRouteId);
            }}
            onSelectStop={stop => setSelectedStop(stop)}
            heightClass="h-[520px] sm:h-[580px]"
          />

          {/* Corridor Intermediate Stops Bar */}
          {activeRoute && (
            <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0d6e52]" />
                  Route {activeRoute.code} Stations ({activeRoute.stops.length} Stops across Telangana)
                </span>
                <span className="text-xs text-slate-600">
                  Fare: <strong>₹{activeRoute.fare.toFixed(0)}</strong> &bull; Distance: <strong>{activeRoute.totalDistanceKm} km</strong> &bull; Duration: <strong>{activeRoute.averageDurationMinutes}m</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {activeRoute.stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    onClick={() => setSelectedStop(stop)}
                    className="cursor-pointer group flex items-center shrink-0"
                  >
                    <div className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded p-2 text-center transition-all min-w-[125px]">
                      <div className="text-[9.5px] font-bold text-slate-400 group-hover:text-emerald-700">
                        Stop #{idx + 1}
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                        {stop.name}
                      </div>
                      <div className="text-[9.5px] text-slate-500 font-mono mt-0.5">
                        {stop.code}
                      </div>
                    </div>
                    {idx < activeRoute.stops.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-0.5 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Inspector (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Selected Vehicle Card */}
          {currentSelectedVehicle ? (
            <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-xs">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-xs font-mono font-bold tracking-tight">
                      {currentSelectedVehicle.regNumber}
                    </span>
                    {getOccupancyBadge(currentSelectedVehicle.occupancy)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {currentSelectedVehicle.model}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Depot: <strong className="text-slate-800">{currentSelectedVehicle.depot}</strong>
                  </p>
                </div>
                <div className="p-2 rounded bg-emerald-50 text-emerald-800">
                  <Bus className="w-5 h-5" />
                </div>
              </div>

              {/* Status Indicators Grid */}
              <div className="grid grid-cols-2 gap-2.5 my-3">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-0.5">
                    <Compass className="w-3 h-3 text-[#0d6e52]" />
                    <span>Speed</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {currentSelectedVehicle.speedKmH} <span className="text-xs text-slate-500 font-normal">km/h</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-0.5">
                    <Clock className="w-3 h-3 text-[#0d6e52]" />
                    <span>Punctuality</span>
                  </div>
                  <div className="text-sm font-bold">
                    {currentSelectedVehicle.delayMinutes > 3 ? (
                      <span className="text-rose-700">+{currentSelectedVehicle.delayMinutes}m delay</span>
                    ) : (
                      <span className="text-emerald-700">On Time (IST)</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-0.5">
                    <BatteryCharging className="w-3 h-3 text-[#0d6e52]" />
                    <span>Fuel / Battery</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {currentSelectedVehicle.batteryOrFuelPercent}%
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-0.5">
                    <Users className="w-3 h-3 text-[#0d6e52]" />
                    <span>Occupancy</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {currentSelectedVehicle.occupancyPercent}%
                  </div>
                </div>
              </div>

              {/* Driver & Route Info */}
              <div className="space-y-1.5 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Assigned Driver:</span>
                  <strong className="text-slate-900">{currentSelectedVehicle.assignedDriverName || 'Auto-Dispatched'}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Distance Covered Today:</span>
                  <strong className="text-slate-900 font-mono">{currentSelectedVehicle.totalDistanceTodayKm.toFixed(1)} km</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GPS Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {currentSelectedVehicle.currentLocation.lat.toFixed(4)}, {currentSelectedVehicle.currentLocation.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1.5 text-slate-600">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Wifi className="w-3 h-3 text-emerald-700" /> Digital CCTV
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Wind className="w-3 h-3 text-sky-700" /> {currentSelectedVehicle.airConditioned ? 'AC Coach' : 'Non-AC'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3 h-3 text-purple-700" /> GPS Tracked
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-300 p-6 text-center text-slate-500">
              <Bus className="w-7 h-7 mx-auto text-slate-400 mb-1" />
              <p className="text-xs font-medium">Select a bus from the map or list</p>
            </div>
          )}

          {/* Active Fleet List on Telangana Corridors */}
          <div className="bg-white rounded-lg border border-slate-300 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Telangana Fleet Units ({displayedFleetList.length})
              </h4>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Feed
              </span>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1 pb-2 mb-2 border-b border-slate-100 overflow-x-auto text-[10.5px]">
              {(['All', 'In Service', 'Delayed', 'Depot'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFleetListFilter(tab)}
                  className={`px-2 py-0.5 rounded font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    fleetListFilter === tab
                      ? 'bg-[#0f223d] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {displayedFleetList.map(veh => {
                const route = routes.find(r => r.id === veh.assignedRouteId);
                const isSelected = selectedVehicleId === veh.id;
                const isDelayed = veh.delayMinutes > 3 || veh.status === 'Delayed';
                const isInMaintenance = veh.status === 'Maintenance';
                const isIdle = veh.status === 'Idle / Depot' || veh.status === 'Off Duty';

                return (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setSelectedVehicleId(veh.id);
                      if (veh.assignedRouteId) setSelectedRouteId(veh.assignedRouteId);
                    }}
                    className={`p-2.5 rounded border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isInMaintenance
                            ? '#dc2626'
                            : isIdle
                            ? '#64748b'
                            : route?.color || '#0d6e52'
                        }}
                      >
                        {route ? `L${route.code}` : isInMaintenance ? 'M' : 'D'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-mono text-[11.5px] flex items-center gap-1.5">
                          <span>{veh.regNumber}</span>
                          {veh.isSimulating && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                          {veh.speedKmH > 0 ? `${veh.speedKmH} km/h` : veh.status} &bull; {veh.depot.split(' ')[0]}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isInMaintenance ? (
                        <span className="text-[9.5px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          Maintenance
                        </span>
                      ) : isDelayed ? (
                        <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          +{veh.delayMinutes}m
                        </span>
                      ) : isIdle ? (
                        <span className="text-[9.5px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          At Depot
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          On Time
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Stop Details Card */}
          {selectedStop && (
            <div className="bg-slate-50 rounded-lg border border-slate-300 p-3.5 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  Station: {selectedStop.name}
                </span>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  &times;
                </button>
              </div>
              {selectedStop.teluguName && (
                <div className="text-xs text-emerald-800 font-semibold mb-1">
                  {selectedStop.teluguName}
                </div>
              )}
              <p className="text-slate-600 text-[11px] mb-2">{selectedStop.zone} &bull; Code: {selectedStop.code}</p>
              <div className="flex flex-wrap gap-1">
                {selectedStop.amenities.map(a => (
                  <span key={a} className="bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
