import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { exportToCSV, printSection } from '../utils/exportUtils';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Bus,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Star,
  Activity,
  Layers,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface ReportsScreenProps {
  initialTab?: 'schedule' | 'vehicle' | 'feedback' | 'delay';
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ initialTab = 'schedule' }) => {
  const { schedules, vehicles, feedbacks, delays, routes } = useTransit();

  const [activeReportTab, setActiveReportTab] = useState<
    'schedule' | 'vehicle' | 'feedback' | 'delay'
  >(initialTab);

  // Filters
  const [routeFilter, setRouteFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Export Handlers
  const handleExportScheduleReport = () => {
    const headers = [
      'Trip ID',
      'Route Code',
      'Route Name',
      'Vehicle ID',
      'Driver Name',
      'Scheduled Dep.',
      'Actual Dep.',
      'Scheduled Arr.',
      'Actual Arr.',
      'Variance (Mins)',
      'Status',
      'On-Time Rate %'
    ];
    const rows = schedules.map(s => [
      s.tripId,
      s.routeCode,
      s.routeName,
      s.vehicleId,
      s.driverName,
      s.departureTime,
      s.actualDepartureTime || s.departureTime,
      s.arrivalTime,
      s.actualArrivalTime || s.arrivalTime,
      s.varianceMinutes,
      s.status,
      `${s.onTimeRate}%`
    ]);
    exportToCSV('TGSRTC_RouteWise_Schedule_Report', headers, rows);
  };

  const handleExportVehicleActivityReport = () => {
    const headers = [
      'Vehicle Reg.',
      'Model',
      'Transport Mode',
      'Assigned Route',
      'Assigned Driver',
      'Current Speed (km/h)',
      'Total km Today',
      'Battery / Fuel %',
      'Occupancy',
      'Status'
    ];
    const rows = vehicles.map(v => {
      const r = routes.find(route => route.id === v.assignedRouteId);
      return [
        v.regNumber,
        v.model,
        v.mode,
        r ? `Line ${r.code}` : 'Depot',
        v.assignedDriverName || 'Unassigned',
        v.speedKmH,
        v.totalDistanceTodayKm.toFixed(1),
        `${v.batteryOrFuelPercent}%`,
        v.occupancy,
        v.status
      ];
    });
    exportToCSV('TGSRTC_Vehicle_Activity_Report', headers, rows);
  };

  const handleExportFeedbackReport = () => {
    const headers = [
      'Feedback ID',
      'Passenger Name',
      'Route Code',
      'Vehicle ID',
      'Rating (1-5)',
      'Category',
      'Comment',
      'Sentiment',
      'Status',
      'Timestamp'
    ];
    const rows = feedbacks.map(f => [
      f.id,
      f.passengerName,
      f.routeCode,
      f.vehicleId || 'N/A',
      f.rating,
      f.category,
      f.comment,
      f.sentiment,
      f.status,
      f.timestamp
    ]);
    exportToCSV('TGSRTC_Passenger_Feedback_Report', headers, rows);
  };

  const handleExportDelayReport = () => {
    const headers = [
      'Incident ID',
      'Route Code',
      'Route Name',
      'Delay (Mins)',
      'Root Cause',
      'Reported By',
      'Severity',
      'Status',
      'Mitigation Action Taken',
      'Reported Time'
    ];
    const rows = delays.map(d => [
      d.id,
      d.routeCode,
      d.routeName,
      d.delayMinutes,
      d.cause,
      `${d.reportedByName} (${d.reportedByRole})`,
      d.severity,
      d.status,
      d.actionTaken,
      d.reportedAt
    ]);
    exportToCSV('TGSRTC_Service_Delay_Report', headers, rows);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Mandatory Regulatory Reports &amp; Analytics
            </h1>
            <Badge variant="blue">Official Audit Center</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compliant with Section 58 Transit Regulatory Framework: Route-wise Schedules, Vehicle Activities, Passenger Feedback, and Service Delays.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeReportTab === 'schedule') handleExportScheduleReport();
              else if (activeReportTab === 'vehicle') handleExportVehicleActivityReport();
              else if (activeReportTab === 'feedback') handleExportFeedbackReport();
              else handleExportDelayReport();
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-transit-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => printSection('mandatory-report-table', `Official ${activeReportTab.toUpperCase()} Report`)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-transit-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Mandatory Reports Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            id: 'schedule',
            label: '1. Route-wise Schedule Report',
            sub: 'Punctuality & Variances',
            icon: <Calendar className="w-4 h-4" />
          },
          {
            id: 'vehicle',
            label: '2. Vehicle Activity Report',
            sub: 'Fleet Distance & Telemetry',
            icon: <Bus className="w-4 h-4" />
          },
          {
            id: 'feedback',
            label: '3. Passenger Feedback Report',
            sub: 'Commuter Reviews & CSAT',
            icon: <MessageSquare className="w-4 h-4" />
          },
          {
            id: 'delay',
            label: '4. Service Delay Report',
            sub: 'Incidents & Root Causes',
            icon: <AlertTriangle className="w-4 h-4" />
          }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeReportTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-transit-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-lg w-fit mb-2 ${
              activeReportTab === tab.id ? 'bg-slate-800 text-transit-400' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.icon}
            </div>
            <div className="text-xs font-extrabold tracking-tight truncate">{tab.label}</div>
            <div className={`text-[10px] ${activeReportTab === tab.id ? 'text-slate-400' : 'text-slate-500'}`}>
              {tab.sub}
            </div>
          </button>
        ))}
      </div>

      {/* REPORT 1: ROUTE-WISE SCHEDULE REPORT */}
      {activeReportTab === 'schedule' && (
        <div className="space-y-4" id="mandatory-report-table">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              title="Total Scheduled Trips"
              value={schedules.length}
              subValue="Daily timetable slots"
              icon={<Calendar className="w-4 h-4 text-transit-600" />}
            />
            <StatCard
              title="Network On-Time Rate"
              value="95.4%"
              subValue="Compliance target: 95%"
              icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
              trend={{ value: '0.8%', isPositive: true }}
            />
            <StatCard
              title="Average Variance"
              value="+1.8m"
              subValue="Schedule vs Actual"
              icon={<Clock className="w-4 h-4 text-amber-600" />}
            />
            <StatCard
              title="Delayed Trips"
              value={schedules.filter(s => s.status === 'Delayed').length}
              subValue="Under investigation"
              icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Route-wise Schedule Performance &amp; Timetable Adherence
                </h3>
                <p className="text-xs text-slate-500">Official timetable comparison against real telemetry arrivals</p>
              </div>
              <Badge variant="green">{schedules.length} Trips Recorded</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Trip ID</th>
                    <th className="py-3 px-3">Corridor</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Driver</th>
                    <th className="py-3 px-3">Sched. Departure</th>
                    <th className="py-3 px-3">Actual Dep.</th>
                    <th className="py-3 px-3">Sched. Arrival</th>
                    <th className="py-3 px-3">Actual Arr.</th>
                    <th className="py-3 px-3">Variance</th>
                    <th className="py-3 px-3">On-Time %</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {schedules.map(sch => (
                    <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{sch.tripId}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        Line {sch.routeCode} ({sch.routeName})
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-600">{sch.vehicleId}</td>
                      <td className="py-3 px-3">{sch.driverName}</td>
                      <td className="py-3 px-3">{sch.departureTime}</td>
                      <td className="py-3 px-3 font-semibold">{sch.actualDepartureTime || sch.departureTime}</td>
                      <td className="py-3 px-3">{sch.arrivalTime}</td>
                      <td className="py-3 px-3 font-semibold">{sch.actualArrivalTime || sch.arrivalTime}</td>
                      <td className="py-3 px-3 font-mono font-bold">
                        {sch.varianceMinutes > 0 ? (
                          <span className="text-rose-600">+{sch.varianceMinutes}m</span>
                        ) : sch.varianceMinutes < 0 ? (
                          <span className="text-emerald-600">{sch.varianceMinutes}m</span>
                        ) : (
                          <span className="text-slate-500">0m</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-transit-700">{sch.onTimeRate}%</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sch.status === 'On Time' || sch.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: VEHICLE ACTIVITY REPORT */}
      {activeReportTab === 'vehicle' && (
        <div className="space-y-4" id="mandatory-report-table">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              title="Fleet Size"
              value={vehicles.length}
              subValue="Registered vehicles"
              icon={<Bus className="w-4 h-4 text-transit-600" />}
            />
            <StatCard
              title="Fleet Distance Covered"
              value={`${vehicles.reduce((a, b) => a + b.totalDistanceTodayKm, 0).toFixed(1)} km`}
              subValue="Cumulative today"
              icon={<Activity className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              title="Active Fleet Utilization"
              value={`${Math.round((vehicles.filter(v => v.status === 'In Service').length / vehicles.length) * 100)}%`}
              subValue="In Active Service"
              icon={<TrendingUp className="w-4 h-4 text-purple-600" />}
            />
            <StatCard
              title="Avg Battery / Fuel"
              value={`${Math.round(vehicles.reduce((a, b) => a + b.batteryOrFuelPercent, 0) / vehicles.length)}%`}
              subValue="Fleet Charge Level"
              icon={<Clock className="w-4 h-4 text-blue-600" />}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Vehicle Activity, Telemetry &amp; Utilization Report
                </h3>
                <p className="text-xs text-slate-500">Mileage, battery status, operational mode, and driver assignments</p>
              </div>
              <Badge variant="blue">{vehicles.length} Active Units</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Reg Number</th>
                    <th className="py-3 px-3">Vehicle Model</th>
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3">Assigned Route</th>
                    <th className="py-3 px-3">Assigned Driver</th>
                    <th className="py-3 px-3">Speed (km/h)</th>
                    <th className="py-3 px-3">Distance Today</th>
                    <th className="py-3 px-3">Battery / Fuel</th>
                    <th className="py-3 px-3">Occupancy</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vehicles.map(v => {
                    const r = routes.find(route => route.id === v.assignedRouteId);
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{v.regNumber}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{v.model}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                            {v.mode}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium">
                          {r ? `Line ${r.code}` : 'Depot'}
                        </td>
                        <td className="py-3 px-3">{v.assignedDriverName || 'Unassigned'}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{v.speedKmH} km/h</td>
                        <td className="py-3 px-3 font-mono font-bold text-transit-700">
                          {v.totalDistanceTodayKm.toFixed(1)} km
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">{v.batteryOrFuelPercent}%</td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-semibold">{v.occupancy} ({v.occupancyPercent}%)</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'In Service' ? 'bg-emerald-100 text-emerald-800' :
                            v.status === 'Delayed' ? 'bg-rose-100 text-rose-800' :
                            v.status === 'Maintenance' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {v.status}
                          </span>
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

      {/* REPORT 3: PASSENGER FEEDBACK REPORT */}
      {activeReportTab === 'feedback' && (
        <div className="space-y-4" id="mandatory-report-table">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              title="Customer Satisfaction"
              value="4.6 / 5.0"
              subValue="CSAT Rating"
              icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
            />
            <StatCard
              title="Positive Sentiment"
              value={`${Math.round((feedbacks.filter(f => f.sentiment === 'Positive').length / feedbacks.length) * 100)}%`}
              subValue="Commuter approvals"
              icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              title="Total Reviews"
              value={feedbacks.length}
              subValue="Logged passengers"
              icon={<MessageSquare className="w-4 h-4 text-purple-600" />}
            />
            <StatCard
              title="Resolution Rate"
              value="100%"
              subValue="Actioned by Authority"
              icon={<CheckCircle className="w-4 h-4 text-blue-600" />}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Passenger Experience &amp; Satisfaction Audit Report
                </h3>
                <p className="text-xs text-slate-500">Service quality scores, cleanliness, safety remarks, and official feedback resolution</p>
              </div>
              <Badge variant="purple">{feedbacks.length} Submissions</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Feedback ID</th>
                    <th className="py-3 px-3">Passenger</th>
                    <th className="py-3 px-3">Route</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-4">Comment</th>
                    <th className="py-3 px-3">Sentiment</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {feedbacks.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{f.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{f.passengerName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-transit-700">Line {f.routeCode}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{f.vehicleId || 'N/A'}</td>
                      <td className="py-3 px-3">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < f.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold">{f.category}</td>
                      <td className="py-3 px-4 max-w-xs text-slate-600 italic">
                        "{f.comment}"
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-800' :
                          f.sentiment === 'Negative' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.sentiment}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 4: SERVICE DELAY REPORT */}
      {activeReportTab === 'delay' && (
        <div className="space-y-4" id="mandatory-report-table">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              title="Total Logged Incidents"
              value={delays.length}
              subValue="Today's disruptions"
              icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
            />
            <StatCard
              title="Active Delays"
              value={delays.filter(d => d.status === 'Active').length}
              subValue="Dispatch priority"
              icon={<Clock className="w-4 h-4 text-rose-600" />}
            />
            <StatCard
              title="Primary Root Cause"
              value="Traffic Congestion"
              subValue="66% of occurrences"
              icon={<Bus className="w-4 h-4 text-purple-600" />}
            />
            <StatCard
              title="Resolved Incidents"
              value={delays.filter(d => d.status === 'Resolved').length}
              subValue="Cleared by operations"
              icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Service Delay, Route Disruption &amp; Root Cause Analysis Report
                </h3>
                <p className="text-xs text-slate-500">Incident history, root cause categorization, severity, and mitigation measures</p>
              </div>
              <Badge variant="amber">{delays.length} Recorded Delays</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Incident ID</th>
                    <th className="py-3 px-3">Route Affected</th>
                    <th className="py-3 px-3">Delay (Minutes)</th>
                    <th className="py-3 px-3">Root Cause</th>
                    <th className="py-3 px-3">Reported By</th>
                    <th className="py-3 px-3">Reported Time</th>
                    <th className="py-3 px-3">Severity</th>
                    <th className="py-3 px-4">Mitigation Action Taken</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {delays.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{d.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        Line {d.routeCode} ({d.routeName})
                      </td>
                      <td className="py-3 px-3 font-mono font-extrabold text-rose-600">
                        +{d.delayMinutes} mins
                      </td>
                      <td className="py-3 px-3 font-semibold">{d.cause}</td>
                      <td className="py-3 px-3 text-slate-600">
                        {d.reportedByName} ({d.reportedByRole})
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{d.reportedAt}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.severity === 'Critical' || d.severity === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : d.severity === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {d.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-slate-600">
                        {d.actionTaken}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
