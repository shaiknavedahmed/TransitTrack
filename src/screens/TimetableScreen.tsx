import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { TransitRoute } from '../types';
import { exportToCSV, printSection } from '../utils/exportUtils';
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Bus,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const TimetableScreen: React.FC = () => {
  const { routes, currentUser, togglePublishRoute } = useTransit();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const [dayType, setDayType] = useState<'Weekday' | 'Weekend'>('Weekday');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('All');

  const isPassenger = currentUser.role === 'Passenger';
  const displayRoutes = isPassenger ? routes.filter(r => r.isPublished) : routes;

  const filteredRoutes = displayRoutes.filter(r => {
    const matchesQuery =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === 'All' || r.mode === modeFilter;
    return matchesQuery && matchesMode;
  });

  const selectedRoute = filteredRoutes.find(r => r.id === selectedRouteId) || filteredRoutes[0] || routes[0];

  // Generate timetable departure slots based on operating hours and frequency
  const generateDepartureTimes = (route: TransitRoute) => {
    const times: { tripId: string; departure: string; arrival: string; type: string }[] = [];
    const [startHourStr] = route.operatingHours.split(' - ');
    const startHour = parseInt(startHourStr.split(':')[0], 10) || 6;
    
    // Generate 8 sample timetable trips throughout the day
    for (let i = 0; i < 8; i++) {
      const hour = startHour + Math.floor((i * route.frequencyMinutes * 2) / 60);
      const min = (i * route.frequencyMinutes * 2) % 60;
      const formattedHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const depStr = `${formattedHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;
      
      const arrTotalMin = hour * 60 + min + route.averageDurationMinutes;
      const arrHour = Math.floor(arrTotalMin / 60);
      const arrMin = arrTotalMin % 60;
      const arrFormattedHour = arrHour > 12 ? arrHour - 12 : arrHour;
      const arrAmpm = arrHour >= 12 ? 'PM' : 'AM';
      const arrStr = `${arrFormattedHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')} ${arrAmpm}`;

      times.push({
        tripId: `TR-${route.code}-${100 + i}`,
        departure: depStr,
        arrival: arrStr,
        type: i % 3 === 0 ? 'Peak Frequency' : 'Regular Service'
      });
    }
    return times;
  };

  const timetableTrips = selectedRoute ? generateDepartureTimes(selectedRoute) : [];

  const handleExportCSV = () => {
    if (!selectedRoute) return;
    const headers = ['Trip ID', 'Route Code', 'Route Name', 'Origin Stop', 'Destination Stop', 'Departure Time', 'Est Arrival', 'Service Type'];
    const origin = selectedRoute.stops[0]?.name || 'Origin';
    const destination = selectedRoute.stops[selectedRoute.stops.length - 1]?.name || 'Destination';

    const rows = timetableTrips.map(trip => [
      trip.tripId,
      selectedRoute.code,
      selectedRoute.name,
      origin,
      destination,
      trip.departure,
      trip.arrival,
      trip.type
    ]);

    exportToCSV(`TGSRTC_Timetable_Route_${selectedRoute.code}`, headers, rows);
  };

  const canManageRoutes = currentUser.role === 'Admin' || currentUser.role === 'Transport Operator';

  return (
    <div className="space-y-6">
      
      {/* Screen Title & Quick Actions */}
      <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Telangana Route Directory &amp; Timetable Information
            </h1>
            <Badge variant="blue">TGSRTC Official Schedule</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse published bus corridors across Warangal, Hanamkonda, Kazipet, Hyderabad, Karimnagar, intermediate stops, fare stages (₹), and departures (IST).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#0d6e52]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => printSection('printable-timetable', `Route ${selectedRoute?.code} Timetable`)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#0c1a2e] hover:bg-slate-800 text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Search & Mode Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by route code, name, or street keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-transit-500/20 focus:border-transit-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['All', 'Bus', 'Tram', 'Express Shuttle'].map(mode => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                modeFilter === mode
                  ? 'bg-transit-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid: Route List (Left) + Timetable Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Route Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Available Corridors ({filteredRoutes.length})
          </h3>

          <div className="space-y-2.5">
            {filteredRoutes.map(route => {
              const isSelected = selectedRoute?.id === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-transit-500 shadow-md ring-2 ring-transit-500/10'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 bottom-0 w-1.5"
                    style={{ backgroundColor: route.color }}
                  />

                  <div className="pl-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-lg text-white font-extrabold text-xs flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: route.color }}
                        >
                          {route.code}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{route.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {route.mode}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 my-1.5 leading-relaxed">
                      {route.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Every {route.frequencyMinutes}m
                      </span>
                      <span className="flex items-center gap-0.5 font-semibold text-slate-800">
                        <IndianRupee className="w-3 h-3 text-emerald-700" />
                        {route.fare.toFixed(0)}
                      </span>
                      {route.isPublished ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </div>

                    {/* Operator quick toggle publish */}
                    {canManageRoutes && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">Publish Status:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePublishRoute(route.id);
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                            route.isPublished
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {route.isPublished ? 'Unpublish' : 'Publish to Public'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timetable & Route Stops Details (8 Cols) */}
        {selectedRoute && (
          <div className="lg:col-span-8 space-y-6" id="printable-timetable">
            
            {/* Selected Route Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl text-white font-extrabold text-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: selectedRoute.color }}
                  >
                    {selectedRoute.code}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedRoute.name}</h2>
                    <p className="text-xs text-slate-500">
                      Mode: <strong className="text-slate-700">{selectedRoute.mode}</strong> &bull; Operating Hours: <strong className="text-slate-700">{selectedRoute.operatingHours}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
                    {(['Weekday', 'Weekend'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setDayType(d)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                          dayType === d ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Route Summary KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Distance</span>
                  <div className="text-base font-bold text-slate-800">{selectedRoute.totalDistanceKm} km</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Avg Trip Duration</span>
                  <div className="text-base font-bold text-slate-800">{selectedRoute.averageDurationMinutes} mins</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Headway Frequency</span>
                  <div className="text-base font-bold text-slate-800">Every {selectedRoute.frequencyMinutes} mins</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Standard Single Fare</span>
                  <div className="text-base font-bold text-emerald-700">₹{selectedRoute.fare.toFixed(0)}</div>
                </div>
              </div>

              {/* Timetable Departures Table */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span>Scheduled Daily Departures ({dayType})</span>
                  <span className="text-[11px] text-transit-600 font-semibold">
                    Origin: {selectedRoute.stops[0]?.name}
                  </span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Trip ID</th>
                        <th className="py-2.5 px-3">Departure (First Stop)</th>
                        <th className="py-2.5 px-3">Est. Terminal Arrival</th>
                        <th className="py-2.5 px-3">Service Tier</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {timetableTrips.map(trip => (
                        <tr key={trip.tripId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{trip.tripId}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{trip.departure}</td>
                          <td className="py-2.5 px-3 text-slate-600">{trip.arrival}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {trip.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <CheckCircle className="w-3 h-3" /> Regular
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sequence of Stops Timeline */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-transit-600" />
                  Official Stop Sequence &amp; Station Amenities ({selectedRoute.stops.length} stations)
                </h3>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-transit-300">
                  {selectedRoute.stops.map((stop, index) => {
                    const isFirst = index === 0;
                    const isLast = index === selectedRoute.stops.length - 1;

                    return (
                      <div key={stop.id} className="relative group">
                        {/* Dot on line */}
                        <div
                          className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-125 ${
                            isFirst || isLast ? 'bg-transit-600 ring-2 ring-transit-300' : 'bg-slate-400'
                          }`}
                        />

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 hover:border-transit-300 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-400 font-mono">
                                #{index + 1}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">{stop.name}</h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                {stop.code}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{stop.zone}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {stop.amenities.map(am => (
                              <span
                                key={am}
                                className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium"
                              >
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
