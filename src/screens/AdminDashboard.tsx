import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { UserRole } from '../types';
import {
  Shield,
  Bus,
  Users,
  Activity,
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  UserPlus,
  Send,
  Zap,
  TrendingUp,
  Sliders
} from 'lucide-react';

export const AdminDashboard: React.FC<{
  onNavigateToReports?: (tab?: 'schedule' | 'vehicle' | 'feedback' | 'delay') => void;
  onNavigateToScreen?: (screen: string) => void;
}> = ({ onNavigateToReports, onNavigateToScreen }) => {
  const {
    vehicles,
    routes,
    users,
    auditLogs,
    delays,
    feedbacks,
    logAction,
    reportDelay,
    addUser,
    setVehicleMaintenance
  } = useTransit();

  // Broadcast modal state
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [broadcastRouteId, setBroadcastRouteId] = useState(routes[0]?.id || '');

  // Add staff modal state
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('Driver');
  const [staffBadge, setStaffBadge] = useState('');
  const [staffCompany, setStaffCompany] = useState('TGSRTC Warangal Region');

  const activeVehicles = vehicles.filter(v => v.status === 'In Service');
  const maintenanceVehicles = vehicles.filter(v => v.status === 'Maintenance');
  const activeDelays = delays.filter(d => d.status === 'Active');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const route = routes.find(r => r.id === broadcastRouteId);

    reportDelay({
      routeId: broadcastRouteId,
      routeCode: route?.code || 'ALL',
      routeName: route?.name || 'TGSRTC Telangana Regional Network',
      delayMinutes: 10,
      cause: 'Traffic Congestion',
      affectedStops: route ? route.stops.map(s => s.code) : [],
      reportedByRole: 'Admin',
      reportedByName: 'TGSRTC Central Traffic Control Room',
      estimatedResolutionTime: 'Next 45 mins IST',
      actionTaken: broadcastMessage,
      severity: broadcastSeverity
    });

    logAction('Emergency Broadcast', `System Alert broadcasted to network: ${broadcastMessage}`);
    setBroadcastMessage('');
    setBroadcastOpen(false);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;

    const newStaff = {
      id: `usr-${Date.now()}`,
      name: staffName,
      email: staffEmail,
      username: staffName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      password: `${staffRole.toLowerCase().replace(/\s+/g, '')}123`,
      role: staffRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      badgeNumber: staffBadge || `STF-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorCompany: staffCompany
    };

    addUser(newStaff);

    setStaffName('');
    setStaffEmail('');
    setStaffBadge('');
    setAddStaffOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Master Operations Center
            </h1>
            <Badge variant="purple">Root Authority</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fleet health, staff oversight, emergency broadcast console, and system audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBroadcastOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Network Alert</span>
          </button>

          <button
            onClick={() => setAddStaffOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-transit-600 hover:bg-transit-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Staff</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Vehicles on Route"
          value={`${activeVehicles.length} / ${vehicles.length}`}
          subValue="Units"
          icon={<Bus className="w-5 h-5 text-transit-600" />}
          accentColor="bg-transit-500"
          trend={{ value: '2 units deployed', isPositive: true }}
        />
        <StatCard
          title="Fleet On-Time Rate"
          value="95.4%"
          subValue="Target: 95%"
          icon={<Clock className="w-5 h-5 text-emerald-600" />}
          accentColor="bg-emerald-500"
          trend={{ value: '1.2%', isPositive: true }}
        />
        <StatCard
          title="Active Delays / Incidents"
          value={activeDelays.length}
          subValue="Active Alerts"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          accentColor="bg-amber-500"
        />
        <StatCard
          title="Passenger Reviews"
          value={feedbacks.length}
          subValue="Average 4.6★"
          icon={<Users className="w-5 h-5 text-purple-600" />}
          accentColor="bg-purple-500"
          trend={{ value: '100% replied', isPositive: true }}
        />
      </div>

      {/* 4 Mandatory Reports Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                Regulatory Compliance
              </span>
              <h3 className="font-bold text-slate-900 text-sm">4 Mandatory Transit Authority Reports</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory reports required by Telangana State Road Transport Corporation with CSV &amp; Print exports.
            </p>
          </div>
          {onNavigateToReports && (
            <button
              onClick={() => onNavigateToReports('schedule')}
              className="text-xs font-bold text-transit-600 hover:text-transit-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>View All Reports Center &rarr;</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Report 1 */}
          <div
            onClick={() => onNavigateToReports && onNavigateToReports('schedule')}
            className="p-4 rounded-xl border border-slate-200 hover:border-transit-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">Daily Ops</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Route-wise Schedule Report</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Trip timetables, scheduled vs actual departure, and on-time adherence.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-transit-700">
              <span>Inspect Schedule</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Report 2 */}
          <div
            onClick={() => onNavigateToReports && onNavigateToReports('vehicle')}
            className="p-4 rounded-xl border border-slate-200 hover:border-transit-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Bus className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">Fleet KPI</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Vehicle Activity Report</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Daily kilometers, fuel/battery efficiency, speed logs, and maintenance logs.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-transit-700">
              <span>Inspect Activity</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Report 3 */}
          <div
            onClick={() => onNavigateToReports && onNavigateToReports('feedback')}
            className="p-4 rounded-xl border border-slate-200 hover:border-transit-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">Satisfaction</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Passenger Feedback Report</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Star ratings, commuter reviews, sentiment breakdown, and grievance redressal.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-transit-700">
              <span>Inspect Feedback</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Report 4 */}
          <div
            onClick={() => onNavigateToReports && onNavigateToReports('delay')}
            className="p-4 rounded-xl border border-slate-200 hover:border-transit-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">Incidents</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Service Delay Report</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Active &amp; resolved delay incidents, root cause audits, and mitigation measures.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-transit-700">
              <span>Inspect Delays</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Overview Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bus className="w-4 h-4 text-emerald-600" />
              Telangana Regional Fleet Overview
            </h3>
            <p className="text-xs text-slate-500">Live operational status across Warangal, Hanamkonda &amp; Hyderabad depots</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeVehicles.length} In Service
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
              {activeDelays.length} Delayed
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
              {maintenanceVehicles.length} Maintenance
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Vehicle / Plate</th>
                <th className="py-2.5 px-2">Assigned Corridor</th>
                <th className="py-2.5 px-2">Assigned Driver</th>
                <th className="py-2.5 px-2">Depot</th>
                <th className="py-2.5 px-2">Speed &bull; Fuel</th>
                <th className="py-2.5 px-2">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {vehicles.map(v => {
                const assignedR = routes.find(r => r.id === v.assignedRouteId);
                return (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-slate-900">{v.regNumber}</div>
                      <div className="text-[10px] text-slate-400">{v.model}</div>
                    </td>
                    <td className="py-2.5 px-2">
                      {assignedR ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: assignedR.color }} />
                          Line {assignedR.code}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 font-medium">
                      {v.assignedDriverName || 'Spare Driver'}
                    </td>
                    <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px]">
                      {v.depot}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-semibold text-slate-900">{v.speedKmH} km/h</div>
                      <div className="text-[10px] text-emerald-600 font-mono">{v.batteryOrFuelPercent}% fuel</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'In Service' ? 'bg-emerald-100 text-emerald-700' :
                        v.status === 'Delayed' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setVehicleMaintenance(v.id, v.status !== 'Maintenance')}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            v.status === 'Maintenance'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {v.status === 'Maintenance' ? 'Release' : 'Maint.'}
                        </button>
                        {onNavigateToScreen && (
                          <button
                            onClick={() => onNavigateToScreen('live-map')}
                            className="text-[11px] font-bold text-transit-600 hover:text-transit-800 underline"
                          >
                            Locate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Grid: Staff Management Table & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Staff & Operator Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Authorized Personnel Directory</h3>
              <p className="text-xs text-slate-500">Dispatchers, drivers, and supervisory personnel</p>
            </div>
            <button
              onClick={() => setAddStaffOpen(true)}
              className="text-xs font-bold text-transit-600 hover:text-transit-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Staff
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Personnel</th>
                  <th className="py-2.5 px-2">Role</th>
                  <th className="py-2.5 px-2">Badge ID</th>
                  <th className="py-2.5 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'Transport Operator' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'Driver' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px] font-bold text-slate-600">
                      {u.badgeNumber || 'N/A'}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Audit Logs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                Live System Audit Trail
              </h3>
              <p className="text-xs text-slate-500">Immutable ledger of administrative &amp; operational actions</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{log.details}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px] text-slate-400">
                  <span>By: <strong>{log.actor}</strong> ({log.role})</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal: Emergency Network Broadcast */}
      <Modal
        isOpen={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        title="Broadcast Network Transit Advisory"
        subtitle="This message will immediately propagate to all passenger screens, maps, and notification banners."
      >
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Route / Network</label>
            <select
              value={broadcastRouteId}
              onChange={e => setBroadcastRouteId(e.target.value)}
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Advisory Severity Level</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as const).map(sev => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setBroadcastSeverity(sev)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    broadcastSeverity === sev
                      ? sev === 'Critical'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Advisory Content / Passenger Message</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Due to flyover construction on NH-163 near Jangaon, Line 408 buses are detouring via Aler bypass with 10 min delay."
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setBroadcastOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Advisory Now</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Staff Personnel */}
      <Modal
        isOpen={addStaffOpen}
        onClose={() => setAddStaffOpen(false)}
        title="Onboard New Transport Staff"
        subtitle="Register drivers, dispatch operators, or supervisors into the identity registry."
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. B. Suresh Kumar"
              value={staffName}
              onChange={e => setStaffName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                required
                placeholder="suresh@tgsrtc.telangana.gov.in"
                value={staffEmail}
                onChange={e => setStaffEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">System Role</label>
              <select
                value={staffRole}
                onChange={e => setStaffRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              >
                <option value="Driver">Driver</option>
                <option value="Transport Operator">Transport Operator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge ID / License</label>
              <input
                type="text"
                placeholder="TG-DRV-2041"
                value={staffBadge}
                onChange={e => setStaffBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operating Depot / Division</label>
              <input
                type="text"
                value={staffCompany}
                onChange={e => setStaffCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddStaffOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-transit-600 hover:bg-transit-700 text-white flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Staff Member</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
