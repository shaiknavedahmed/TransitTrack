import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { TransitVehicle, OccupancyLevel, DelayCause } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  Bus,
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  Play,
  Pause,
  StopCircle,
  Radio,
  Users,
  Send,
  CheckCircle,
  Navigation,
  BatteryCharging,
  Wifi,
  Wind,
  ShieldCheck,
  Check
} from 'lucide-react';

export const DriverCockpit: React.FC = () => {
  const {
    currentUser,
    routes,
    vehicles,
    updateDriverStatus,
    updateVehicle,
    reportDelay,
    logAction
  } = useTransit();

  // Find vehicle assigned to driver or default to first in-service vehicle
  const driverVehicle =
    vehicles.find(v => v.assignedDriverId === currentUser.id) ||
    vehicles.find(v => v.id === 'veh-101A') ||
    vehicles[0];

  const assignedRoute = routes.find(r => r.id === driverVehicle?.assignedRouteId) || routes[0];

  const [tripState, setTripState] = useState<'In Progress' | 'Paused' | 'Completed'>('In Progress');
  const [speed, setSpeed] = useState<number>(driverVehicle?.speedKmH || 35);
  const [occupancy, setOccupancy] = useState<OccupancyLevel>(driverVehicle?.occupancy || 'Moderate');
  const [delayMinutes, setDelayMinutes] = useState<number>(driverVehicle?.delayMinutes || 0);

  // Delay modal state
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [quickDelayCause, setQuickDelayCause] = useState<DelayCause>('Traffic Congestion');
  const [quickDelayMinutes, setQuickDelayMinutes] = useState(5);
  const [quickDelayNote, setQuickDelayNote] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const [currentStopIndex, setCurrentStopIndex] = useState(1);

  if (!driverVehicle || !assignedRoute) {
    return <div className="p-8 text-center text-slate-500">No vehicle assigned to driver.</div>;
  }

  const currentStop = assignedRoute.stops[currentStopIndex] || assignedRoute.stops[0];
  const nextStop =
    assignedRoute.stops[currentStopIndex + 1] || assignedRoute.stops[0];

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    updateDriverStatus(driverVehicle.id, newSpeed, delayMinutes, occupancy);
  };

  const handleOccupancyChange = (newOccupancy: OccupancyLevel) => {
    setOccupancy(newOccupancy);
    updateDriverStatus(driverVehicle.id, speed, delayMinutes, newOccupancy);
    showNotice(`Occupancy updated to ${newOccupancy}`);
  };

  const handleAdvanceStop = () => {
    const nextIdx = (currentStopIndex + 1) % assignedRoute.stops.length;
    setCurrentStopIndex(nextIdx);

    // Also advance vehicle waypoint to this stop's location
    const targetStop = assignedRoute.stops[nextIdx];
    if (targetStop) {
      updateVehicle({
        ...driverVehicle,
        currentLocation: targetStop.location,
        lastUpdated: 'Just now'
      });
    }

    logAction(
      'Driver Check-in',
      `Driver ${currentUser.name} verified arrival at stop: ${targetStop.name} (${targetStop.code})`
    );
    showNotice(`Checked in at: ${targetStop.name}`);
  };

  const handleReportDelay = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Number(quickDelayMinutes);
    setDelayMinutes(mins);

    reportDelay({
      routeId: assignedRoute.id,
      routeCode: assignedRoute.code,
      routeName: assignedRoute.name,
      vehicleId: driverVehicle.regNumber,
      delayMinutes: mins,
      cause: quickDelayCause,
      affectedStops: [currentStop.code, nextStop.code],
      reportedByRole: 'Driver',
      reportedByName: currentUser.name,
      estimatedResolutionTime: `+${mins + 15} mins`,
      actionTaken: quickDelayNote || `Driver reported on-route delay: ${quickDelayCause}`,
      severity: mins > 10 ? 'High' : 'Medium'
    });

    updateDriverStatus(driverVehicle.id, speed, mins, occupancy);
    showNotice(`Reported +${mins} min delay to Dispatch!`);
    setDelayModalOpen(false);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Trip Status Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Driver Cockpit &amp; GPS Telemetry Console
            </h1>
            <Badge variant="green">CDL Driver Session</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Broadcast live bus coordinates, check in at route stops, update passenger load, and report traffic delays directly to Dispatch.
          </p>
        </div>

        {/* Trip Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {tripState === 'In Progress' ? (
            <button
              onClick={() => {
                setTripState('Paused');
                showNotice('Trip marked as Paused at layover.');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Shift / Layover</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTripState('In Progress');
                showNotice('Shift Trip Resumed.');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume Trip</span>
            </button>
          )}

          <button
            onClick={() => setDelayModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Road Delay</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Active Vehicle Instrument Cluster + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Digital Instrument Cluster (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Telemetry Cockpit */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-transit-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top row in Cockpit */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-transit-400 uppercase font-bold">
                  Assigned Transit Unit
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-extrabold text-white font-mono">{driverVehicle.regNumber}</h2>
                  <span className="px-2 py-0.5 rounded-md bg-transit-600/30 text-transit-300 border border-transit-500/30 text-xs font-bold">
                    {driverVehicle.mode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{driverVehicle.model}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Line</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white font-extrabold text-sm mt-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: assignedRoute.color }} />
                  <span>Line {assignedRoute.code}</span>
                </div>
              </div>
            </div>

            {/* Large Speedometer & Telemetry Dials */}
            <div className="grid grid-cols-3 gap-4 my-8 text-center">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cruising Speed</span>
                <div className="text-4xl sm:text-5xl font-black text-white my-1 font-mono tracking-tight">
                  {speed}
                </div>
                <span className="text-xs text-slate-400 font-medium">km/h</span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delay Variance</span>
                <div className={`text-4xl sm:text-5xl font-black my-1 font-mono tracking-tight ${
                  delayMinutes > 3 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  +{delayMinutes}m
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {delayMinutes > 3 ? 'Delay Active' : 'On Schedule'}
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Battery State</span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 my-1 font-mono tracking-tight">
                  {driverVehicle.batteryOrFuelPercent}%
                </div>
                <span className="text-xs text-slate-400 font-medium">Optimal Range</span>
              </div>
            </div>

            {/* Live GPS Coordinates Broadcaster Readout */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-slate-400">GPS Transmitter Active:</span>
                <span className="text-white font-bold">
                  {driverVehicle.currentLocation.lat.toFixed(5)}, {driverVehicle.currentLocation.lng.toFixed(5)}
                </span>
              </div>
              <span className="text-slate-500 text-[11px]">
                Bearing: {driverVehicle.heading.toFixed(0)}&deg; &bull; Polling: 1.5s
              </span>
            </div>

            {/* Speed Simulation Slider for Driver */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Throttle / Cruise Speed Control:</span>
                <span className="text-white font-bold font-mono">{speed} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={speed}
                onChange={e => handleSpeedChange(Number(e.target.value))}
                className="w-full accent-transit-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0 (Stationary)</span>
                <span>35 (City Core)</span>
                <span>65 (Expressway)</span>
                <span>80 km/h</span>
              </div>
            </div>
          </div>

          {/* Stop-by-Stop Progress & Check-in */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Route Stop Progression</h3>
                <p className="text-xs text-slate-500">Log arrival at upcoming transit station stops</p>
              </div>

              <button
                onClick={handleAdvanceStop}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Check-in at Next Stop &rarr;</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Station</span>
                <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{currentStop.name}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Code: {currentStop.code} &bull; {currentStop.zone}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-transit-50 border border-transit-200">
                <span className="text-[10px] uppercase font-bold text-transit-700">Upcoming Next Stop</span>
                <div className="text-base font-bold text-transit-950 mt-1 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-transit-600" />
                  <span>{nextStop.name}</span>
                </div>
                <div className="text-xs text-transit-700 font-mono mt-0.5">
                  Code: {nextStop.code} &bull; Est. 3 mins away
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Cabin Occupancy & Shift Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Occupancy Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-lg bg-transit-50 text-transit-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cabin Passenger Load Level</h3>
                <p className="text-xs text-slate-500">Live passenger crowding broadcast</p>
              </div>
            </div>

            <div className="space-y-2">
              {(['Empty', 'Low', 'Moderate', 'Crowded', 'Full'] as OccupancyLevel[]).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleOccupancyChange(lvl)}
                  className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    occupancy === lvl
                      ? 'bg-transit-50 border-transit-500 text-transit-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        lvl === 'Empty' || lvl === 'Low'
                          ? 'bg-emerald-500'
                          : lvl === 'Moderate'
                          ? 'bg-blue-500'
                          : lvl === 'Crowded'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>{lvl} Capacity</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {lvl === 'Empty'
                      ? '0%'
                      : lvl === 'Low'
                      ? '25%'
                      : lvl === 'Moderate'
                      ? '60%'
                      : lvl === 'Crowded'
                      ? '85%'
                      : '100%'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Driver Shift Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Official Driver Shift Assignment
            </h3>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Driver Name:</span>
                <strong className="text-slate-900">{currentUser.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Driver Badge ID:</span>
                <strong className="text-slate-900 font-mono">{currentUser.badgeNumber || 'DRV-1099'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Operating Fleet Carrier:</span>
                <span className="text-slate-700">{currentUser.operatorCompany || 'CityLink Transit Fleet'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shift Hours:</span>
                <strong className="text-slate-900">06:00 AM - 02:30 PM</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Distance Driven Today:</span>
                <strong className="text-slate-900 font-mono">
                  {driverVehicle.totalDistanceTodayKm.toFixed(1)} km
                </strong>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Driver Field Delay Reporter */}
      <Modal
        isOpen={delayModalOpen}
        onClose={() => setDelayModalOpen(false)}
        title="Field Delay Report to Dispatch"
        subtitle="Immediately informs Transit Dispatch and passengers waiting at upcoming stations."
      >
        <form onSubmit={handleReportDelay} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delay Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={quickDelayMinutes}
                onChange={e => setQuickDelayMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Root Cause</label>
              <select
                value={quickDelayCause}
                onChange={e => setQuickDelayCause(e.target.value as DelayCause)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              >
                <option value="Traffic Congestion">Traffic Congestion</option>
                <option value="Road Construction">Road Construction</option>
                <option value="Mechanical Issue">Mechanical Issue</option>
                <option value="Adverse Weather">Adverse Weather</option>
                <option value="Accident Clearance">Accident Clearance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quick Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { mins: 5, label: '+5m Downtown Gridlock' },
                { mins: 10, label: '+10m Roadwork Detour' },
                { mins: 15, label: '+15m Vehicle Check' },
                { mins: 25, label: '+25m Severe Breakdown' }
              ].map(preset => (
                <button
                  type="button"
                  key={preset.mins}
                  onClick={() => {
                    setQuickDelayMinutes(preset.mins);
                    setQuickDelayNote(preset.label);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Driver Remark / Station Details</label>
            <textarea
              rows={2}
              placeholder="e.g. Traffic backup past 5th Street junction due to double-parked delivery truck."
              value={quickDelayNote}
              onChange={e => setQuickDelayNote(e.target.value)}
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
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Field Delay</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
