import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { UserRole } from '../types';
import {
  Shield,
  Sliders,
  Bus,
  User,
  CheckCircle,
  Key,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AuthScreen: React.FC<{ onNavigateToScreen?: (screen: string) => void }> = ({
  onNavigateToScreen
}) => {
  const { currentUser, switchRole, users, logAction } = useTransit();
  const [emailInput, setEmailInput] = useState(currentUser.email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [notification, setNotification] = useState<string | null>(null);

  const roleDefinitions: {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    permissions: string[];
    defaultUser: string;
    badge: string;
  }[] = [
    {
      role: 'Admin',
      title: 'System Administrator',
      description: 'Master operational authority over routes, fleets, dispatchers, users, security audits and all 4 mandatory reports.',
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      color: 'border-purple-300 text-purple-700',
      bgColor: 'bg-purple-50 hover:bg-purple-100/70',
      permissions: [
        'Full System Configuration',
        'Fleet Health & KPI Oversight',
        'Staff & Driver Account Control',
        'Export All 4 Regulatory Reports',
        'Audit Log Verification'
      ],
      defaultUser: 'Sarah Jenkins (Chief Director)',
      badge: 'Level 4 Clearance'
    },
    {
      role: 'Transport Operator',
      title: 'Transit Dispatch Operator',
      description: 'Manages routes, stops, coordinates, fleet vehicles, timetable publishing and incident delay advisories.',
      icon: <Sliders className="w-6 h-6 text-blue-600" />,
      color: 'border-blue-300 text-blue-700',
      bgColor: 'bg-blue-50 hover:bg-blue-100/70',
      permissions: [
        'Add & Edit Routes & Stops',
        'Manage Fleet Vehicles & Specs',
        'Publish Official Timetables',
        'Broadcast Service Delays & Detours',
        'Review Passenger Feedback'
      ],
      defaultUser: 'Marcus Vance (Dispatch Manager)',
      badge: 'Dispatch Controller'
    },
    {
      role: 'Driver',
      title: 'Transit Vehicle Driver',
      description: 'Operates active vehicle shift, broadcasts real-time GPS telemetry, logs stop arrivals, and reports road delays.',
      icon: <Bus className="w-6 h-6 text-emerald-600" />,
      color: 'border-emerald-300 text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/70',
      permissions: [
        'Driver Cockpit & GPS Broadcaster',
        'Start / End Shift Trips',
        'Log Immediate Traffic / Breakdown Delays',
        'Update Real-time Occupancy Level',
        'Stop-by-Stop Check-in'
      ],
      defaultUser: 'David Rodriguez (Senior Driver)',
      badge: 'Commercial Driver License'
    },
    {
      role: 'Passenger',
      title: 'Commuter / Passenger',
      description: 'Tracks moving vehicles on the live map, inspects timetables, views service delay bulletins, and submits feedback.',
      icon: <User className="w-6 h-6 text-amber-600" />,
      color: 'border-amber-300 text-amber-700',
      bgColor: 'bg-amber-50 hover:bg-amber-100/70',
      permissions: [
        'Live GPS Vehicle Tracking & ETA',
        'Timetable & Stop Explorer',
        'Active Delay & Alert Bulletins',
        'Submit Journey Ratings & Reviews',
        'Download Public Timetables'
      ],
      defaultUser: 'Elena Rostova (Daily Commuter)',
      badge: 'Smart Card Commuter'
    }
  ];

  const handleSimulateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    setNotification(`Successfully authenticated as ${selectedRole}`);
    setTimeout(() => setNotification(null), 4000);

    if (onNavigateToScreen) {
      if (selectedRole === 'Admin') onNavigateToScreen('admin');
      else if (selectedRole === 'Transport Operator') onNavigateToScreen('operator');
      else if (selectedRole === 'Driver') onNavigateToScreen('driver');
      else onNavigateToScreen('live-map');
    }
  };

  const handleSelectRoleCard = (role: UserRole) => {
    switchRole(role);
    setSelectedRole(role);
    const u = users.find(usr => usr.role === role);
    if (u) setEmailInput(u.email);
    setNotification(`Switched profile to ${role}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Authentication &amp; Role-Based Access Control (RBAC)
            </h1>
            <Badge variant="purple">4 User Roles</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seamlessly test and toggle between all 4 system roles specified in the project requirements.
          </p>
        </div>

        {/* Current Active Badge */}
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl self-start md:self-auto">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Active Session Role</span>
            <strong className="text-white text-sm">{currentUser.role}</strong>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Interactive Role Selection Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Select a Role to Test Capabilities (1-Click Instant Login)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {roleDefinitions.map(def => {
            const isActive = currentUser.role === def.role;
            return (
              <div
                key={def.role}
                onClick={() => handleSelectRoleCard(def.role)}
                className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? 'bg-white border-transit-500 shadow-lg ring-2 ring-transit-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs'
                }`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Active
                  </div>
                )}

                <div>
                  <div className="p-3 rounded-xl bg-slate-50 w-fit mb-3 border border-slate-100">
                    {def.icon}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{def.role}</h4>
                  <div className="text-[11px] font-semibold text-slate-500 mb-2">{def.badge}</div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {def.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Key Permissions:</div>
                  <ul className="space-y-1 mb-4">
                    {def.permissions.slice(0, 3).map((perm, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-transit-500 shrink-0" />
                        <span className="truncate">{perm}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-transit-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{isActive ? 'Current Active Role' : `Switch to ${def.role}`}</span>
                    {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Login Credentials Simulation Card & Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Credentials Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-transit-50 text-transit-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Role Login Simulator</h3>
              <p className="text-xs text-slate-500">Sign in with custom or demo transit authority credentials</p>
            </div>
          </div>

          <form onSubmit={handleSimulateLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Role</label>
              <select
                value={selectedRole}
                onChange={e => {
                  const r = e.target.value as UserRole;
                  setSelectedRole(r);
                  const u = users.find(usr => usr.role === r);
                  if (u) setEmailInput(u.email);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-transit-500/20 font-bold"
              >
                {roleDefinitions.map(d => (
                  <option key={d.role} value={d.role}>
                    {d.role} - {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transit Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-transit-500/20 font-mono"
                  placeholder="user@metrotransit.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Security Token / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-transit-500/20 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-transit-600 shrink-0 mt-0.5" />
              <span>
                Demo mode active. Any password authorizes the selected role and persists in browser local storage.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-transit-400" />
              <span>Authenticate &amp; Open {selectedRole} Screen</span>
            </button>
          </form>
        </div>

        {/* Permissions & Security Matrix (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Role-Based Access Matrix</h3>
          <p className="text-xs text-slate-500 mb-4">Complete breakdown of module authorizations across the 4 roles</p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">System Module / Screen</th>
                  <th className="py-2.5 px-2 text-center">Admin</th>
                  <th className="py-2.5 px-2 text-center">Operator</th>
                  <th className="py-2.5 px-2 text-center">Driver</th>
                  <th className="py-2.5 px-2 text-center">Passenger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Live GPS Fleet Tracking Map</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Route &amp; Stop Management (CRUD)</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Publish Route Timetable Information</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Driver Cockpit &amp; GPS Broadcaster</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Audit</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Monitor</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Control</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Log Traffic / Delay Updates</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Master</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Dispatch</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Field Log</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Passenger Feedback Submission</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">Review</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">Respond</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Submit</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">4 Mandatory Regulatory Reports</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full Export</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓ Full Export</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">View</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">View Public</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
