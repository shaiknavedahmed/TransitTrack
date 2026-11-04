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
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const LiveMapScreen: React.FC = () => {
  const {
    routes,
    stops,
    vehicles,
    selectedRouteId,
    setSelectedRouteId,
    selectedVehicleId,
    setSelectedVehicleId,
    isSimulationRunning
  } = useTransit();

  const [selectedStop, setSelectedStop] = useState<TransitStop | null>(null);

  const activeVehicles = vehicles.filter(v => v.status === 'In Service');
  const currentSelectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || activeVehicles[0];
  const activeRoute = routes.find(r => r.id === selectedRouteId);

  const getOccupancyBadge = (occupancy: TransitVehicle['occupancy']) => {
    switch (occupancy) {
      case 'Empty':
      case 'Low':
        return <Badge variant="green">{occupancy} Load</Badge>;
      case 'Moderate':
        return <Badge variant="blue">{occupancy} Load</Badge>;
      case 'Crowded':
        return <Badge variant="amber">{occupancy} Load</Badge>;
      case 'Full':
        return <Badge variant="red">Fully Packed</Badge>;
      default:
        return <Badge variant="gray">{occupancy}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Route Switcher */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Live Fleet Tracking &amp; GPS Telemetry
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Real-time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active buses, trams, and airport shuttles across metropolitan transit corridors with live simulated GPS updates.
          </p>
        </div>

        {/* Live Network Health Metrics */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <div>
            <div className="text-[10px] uppercase text-slate-400 font-bold">Active Fleet</div>
            <div className="text-sm font-bold text-slate-900">{activeVehicles.length} of {vehicles.length} Units</div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] uppercase text-slate-400 font-bold">GPS Engine</div>
            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {isSimulationRunning ? 'Broadcasting' : 'Paused'}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] uppercase text-slate-400 font-bold">On-Time Index</div>
            <div className="text-sm font-bold text-transit-700">95.4%</div>
          </div>
        </div>
      </div>

      {/* Corridor Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedRouteId(null)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedRouteId === null
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          All Transit Corridors ({routes.length})
        </button>
        {routes.map(route => {
          const isSelected = selectedRouteId === route.id;
          return (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200'
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
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                {route.mode}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Map + Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Leaflet Map (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
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

          {/* Quick Route Stops Bar */}
          {activeRoute && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-transit-600" />
                  Stops on Route {activeRoute.code} ({activeRoute.stops.length} stations)
                </span>
                <span className="text-xs text-slate-500">
                  Fare: <strong>${activeRoute.fare.toFixed(2)}</strong> &bull; Avg Duration: <strong>{activeRoute.averageDurationMinutes}m</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
                {activeRoute.stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    onClick={() => setSelectedStop(stop)}
                    className="cursor-pointer group flex items-center shrink-0"
                  >
                    <div className="bg-slate-50 hover:bg-transit-50 border border-slate-200 hover:border-transit-300 rounded-lg p-2 text-center transition-all min-w-[120px]">
                      <div className="text-[10px] font-bold text-slate-400 group-hover:text-transit-600">
                        Stop #{idx + 1}
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                        {stop.name}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {stop.code}
                      </div>
                    </div>
                    {idx < activeRoute.stops.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-300 mx-1 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Telemetry & Live Inspector (1 Column) */}
        <div className="space-y-4">
          
          {/* Active Vehicle Card */}
          {currentSelectedVehicle ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-transit-100 text-transit-800 text-xs font-extrabold font-mono">
                      {currentSelectedVehicle.regNumber}
                    </span>
                    {getOccupancyBadge(currentSelectedVehicle.occupancy)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {currentSelectedVehicle.model}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mode: <strong className="text-slate-700">{currentSelectedVehicle.mode}</strong>
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-transit-50 text-transit-600">
                  <Bus className="w-6 h-6" />
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Compass className="w-3.5 h-3.5 text-transit-500" />
                    <span>Current Speed</span>
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {currentSelectedVehicle.speedKmH} <span className="text-xs text-slate-500 font-normal">km/h</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5 text-transit-500" />
                    <span>Punctuality</span>
                  </div>
                  <div className="text-lg font-bold">
                    {currentSelectedVehicle.delayMinutes > 3 ? (
                      <span className="text-rose-600">+{currentSelectedVehicle.delayMinutes}m delay</span>
                    ) : (
                      <span className="text-emerald-600">On Time</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-transit-500" />
                    <span>Battery / Range</span>
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {currentSelectedVehicle.batteryOrFuelPercent}%
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Users className="w-3.5 h-3.5 text-transit-500" />
                    <span>Occupancy</span>
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {currentSelectedVehicle.occupancyPercent}%
                  </div>
                </div>
              </div>

              {/* Driver & Route Info */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Assigned Driver:</span>
                  <span className="font-bold text-slate-800">
                    {currentSelectedVehicle.assignedDriverName || 'Auto-Dispatched'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Distance Today:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {currentSelectedVehicle.totalDistanceTodayKm.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current GPS Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {currentSelectedVehicle.currentLocation.lat.toFixed(4)}, {currentSelectedVehicle.currentLocation.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-2 text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" /> 5G Wi-Fi
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Wind className="w-3.5 h-3.5 text-sky-600" /> Climate AC
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> CCTV Safe
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <Bus className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">Select a vehicle from the map or list</p>
            </div>
          )}

          {/* List of Active Vehicles on Route */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Active Fleet on Corridors</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                {activeVehicles.length} Moving
              </span>
            </h4>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {activeVehicles.map(veh => {
                const route = routes.find(r => r.id === veh.assignedRouteId);
                const isSelected = selectedVehicleId === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setSelectedVehicleId(veh.id);
                      if (veh.assignedRouteId) setSelectedRouteId(veh.assignedRouteId);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-transit-50 border-transit-400 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
                        style={{ backgroundColor: route?.color || '#006bc9' }}
                      >
                        {route?.code || 'BUS'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{veh.regNumber}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({veh.mode})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {veh.speedKmH} km/h &bull; Driver: {veh.assignedDriverName?.split(' ')[0] || 'Auto'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {veh.delayMinutes > 3 ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          +{veh.delayMinutes}m
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          On Time
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stop Details Inspector Modal/Card if selected */}
          {selectedStop && (
            <div className="bg-sky-50 rounded-2xl border border-sky-200 p-4 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sky-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  Station Details: {selectedStop.name}
                </span>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-sky-500 hover:text-sky-800 font-bold"
                >
                  &times;
                </button>
              </div>
              <p className="text-slate-600 text-[11px] mb-2">{selectedStop.zone} &bull; Code: {selectedStop.code}</p>
              <div className="flex flex-wrap gap-1">
                {selectedStop.amenities.map(a => (
                  <span key={a} className="bg-white text-sky-800 px-2 py-0.5 rounded border border-sky-200 text-[10px] font-medium">
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
