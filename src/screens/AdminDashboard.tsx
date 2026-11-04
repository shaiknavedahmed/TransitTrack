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

export const AdminDashboard: React.FC<{ onNavigateToReports?: () => void }> = ({
  onNavigateToReports
}) => {
  const {
    vehicles,
    routes,
    users,
    auditLogs,
    delays,
    feedbacks,
    logAction,
    reportDelay
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
  const [staffCompany, setStaffCompany] = useState('CityLink Transit Fleet Co.');
  const [staffList, setStaffList] = useState(users);

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
      routeName: route?.name || 'Metropolitan Core Network',
      delayMinutes: 10,
      cause: 'Traffic Congestion',
      affectedStops: route ? route.stops.map(s => s.code) : [],
      reportedByRole: 'Admin',
      reportedByName: 'Command Central Dispatch',
      estimatedResolutionTime: 'Next 60 mins',
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
      role: staffRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      badgeNumber: staffBadge || `STF-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorCompany: staffCompany
    };

    setStaffList(prev => [...prev, newStaff]);
    logAction('Staff Onboarding', `Admin registered new ${staffRole}: ${staffName} (${newStaff.badgeNumber})`);

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

      {/* Quick Mandatory Reports Access Banner */}
      <div className="bg-gradient-to-r from-transit-900 to-navy-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-transit-500/30 text-transit-300 border border-transit-400/30">
              Regulatory Requirement
            </span>
            <h3 className="text-base font-bold text-white">4 Mandatory Transit Authority Reports Ready</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Route-wise Schedule Report, Vehicle Activity Report, Passenger Feedback Report, and Service Delay Report are compiled and available for CSV export or printing.
          </p>
        </div>

        {onNavigateToReports && (
          <button
            onClick={onNavigateToReports}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-transit-600" />
            <span>Open Mandatory Reports Center &rarr;</span>
          </button>
        )}
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
                {staffList.map(u => (
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
              placeholder="e.g. Due to water main repairs on Market St, buses on Line 101 are detouring via 2nd Ave with 10 min delays."
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
              placeholder="e.g. Alex Morgan"
              value={staffName}
              onChange={e => setStaffName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="alex@metrotransit.org"
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
                placeholder="DRV-9021"
                value={staffBadge}
                onChange={e => setStaffBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operating Company</label>
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
