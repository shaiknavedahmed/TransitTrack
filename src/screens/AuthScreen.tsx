import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { UserRole } from '../types';
import { ROLE_DEFAULT_SCREEN } from '../utils/roleConfig';
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
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Building2,
  Clock
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AuthScreen: React.FC<{ onNavigateToScreen?: (screen: string) => void }> = ({
  onNavigateToScreen
}) => {
  const { currentUser, isAuthenticated, login, logout, users } = useTransit();
  
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'matrix'>('login');

  const demoAccounts: {
    role: UserRole;
    title: string;
    username: string;
    email: string;
    pass: string;
    name: string;
    badge: string;
    depot: string;
    icon: React.ReactNode;
    color: string;
    badgeVariant: 'purple' | 'blue' | 'green' | 'amber';
    description: string;
    responsibilities: string[];
  }[] = [
    {
      role: 'Admin',
      title: 'Managing Director & State Administrator',
      username: 'admin',
      email: 'admin@tgsrtc.gov.in',
      pass: 'admin123',
      name: 'Sri. K. V. Ramanathan, IPS',
      badge: 'IPS-TG-01',
      depot: 'TGSRTC Head Office, Hyderabad',
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-300 bg-purple-50/50 hover:border-purple-500',
      badgeVariant: 'purple',
      description: 'Master operational authority over routes, fleets, divisional controllers, depot staff, safety audits and mandatory reports.',
      responsibilities: [
        'State-Wide Fleet & Telemetry Control',
        'Staff & Driver Account Registry',
        'Export All 4 Regulatory Reports (CSV / Print)',
        'Broadcast Emergency Network Alerts',
        'System Audit Log Verification'
      ]
    },
    {
      role: 'Transport Operator',
      title: 'Divisional & Depot Traffic Manager',
      username: 'operator',
      email: 'operator@tgsrtc.gov.in',
      pass: 'operator123',
      name: 'S. Rajalingam',
      badge: 'RM-WGL-401',
      depot: 'Warangal Regional Control Room',
      icon: <Sliders className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50/50 hover:border-blue-500',
      badgeVariant: 'blue',
      description: 'Manages routes, stops, coordinates, fleet vehicles, timetable publishing and incident delay advisories for Warangal & regional corridors.',
      responsibilities: [
        'Add & Edit Routes, Fares (₹) & Stops',
        'Manage Fleet Vehicles & Depot Allotment',
        'Publish Master Timetables (IST)',
        'Dispatch Delays & Detour Alerts',
        'Review & Address Passenger Complaints'
      ]
    },
    {
      role: 'Driver',
      title: 'TGSRTC Staff Bus Driver',
      username: 'driver',
      email: 'driver@tgsrtc.gov.in',
      pass: 'driver123',
      name: 'Ramesh Goud',
      badge: 'TG-DRV-1089',
      depot: 'Warangal Depot-1',
      icon: <Bus className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-500',
      badgeVariant: 'green',
      description: 'Operates active vehicle shift, broadcasts real-time GPS telemetry, logs stop arrivals, and reports road delays.',
      responsibilities: [
        'Driver Cockpit & GPS Broadcaster',
        'Start / Layover / Complete Shift Trips',
        'Update Real-time Occupancy Level',
        'Stop-by-Stop Arrival Check-In',
        'Report Field Delays & Traffic Detours'
      ]
    },
    {
      role: 'Passenger',
      title: 'Commuter / Daily Passenger',
      username: 'passenger',
      email: 'passenger@tgsrtc.gov.in',
      pass: 'passenger123',
      name: 'Ananya Reddy',
      badge: 'KU-PASS-9042',
      depot: 'Hanamkonda Central',
      icon: <User className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50/50 hover:border-amber-500',
      badgeVariant: 'amber',
      description: 'Tracks moving vehicles on the live map, inspects timetables, views service delay bulletins, and submits feedback.',
      responsibilities: [
        'Point-to-Point Bus Route Finder',
        'Live GPS Vehicle Tracking & ETA',
        'Download Public Timetables & Fares (₹)',
        'Live Service Alerts & Detour Bulletins',
        'Submit Journey Ratings & Grievances'
      ]
    }
  ];

  const handleFillCredentials = (email: string, pass: string) => {
    setUsernameOrEmail(email);
    setPassword(pass);
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMessage('Please enter both username/email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Simulate rapid auth check
    setTimeout(() => {
      const result = login(usernameOrEmail, password);
      setIsLoading(false);

      if (result.success) {
        setSuccessMessage('Authentication successful! Loading role workspace...');
        // Match user to redirect
        const matched = users.find(
          u =>
            u.email.toLowerCase() === usernameOrEmail.toLowerCase().trim() ||
            (u.username && u.username.toLowerCase() === usernameOrEmail.toLowerCase().trim()) ||
            u.role.toLowerCase() === usernameOrEmail.toLowerCase().trim()
        );
        const targetRole = matched?.role || 'Passenger';
        setTimeout(() => {
          if (onNavigateToScreen) {
            onNavigateToScreen(ROLE_DEFAULT_SCREEN[targetRole] || 'live-map');
          }
        }, 500);
      } else {
        setErrorMessage(result.message || 'Invalid credentials.');
      }
    }, 350);
  };

  const handleQuickLoginAs = (role: UserRole) => {
    const acc = demoAccounts.find(a => a.role === role);
    if (!acc) return;
    setUsernameOrEmail(acc.email);
    setPassword(acc.pass);
    const result = login(acc.email, acc.pass);
    if (result.success) {
      setSuccessMessage(`Authenticated as ${role}! Redirecting...`);
      setTimeout(() => {
        if (onNavigateToScreen) {
          onNavigateToScreen(ROLE_DEFAULT_SCREEN[role]);
        }
      }, 400);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6 animate-fade-in">
      
      {/* Top Government & Transit Authority Banner */}
      <div className="bg-[#091526] text-white rounded-xl p-6 border border-slate-800 shadow-elevated relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-[#0d6e52] border border-emerald-400/40 flex items-center justify-center text-white shadow-subtle">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  TGSRTC <span className="text-emerald-400 font-semibold text-base">| తెలంగాణ గమనం</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/50">
                  SECURE ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Government of Telangana &bull; Integrated Public Transport Tracking &amp; Fleet Operations Portal
              </p>
            </div>
          </div>

          {/* If already authenticated, show status & quick logout */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 p-2.5 rounded-lg text-xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-slate-600 object-cover"
              />
              <div>
                <div className="font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {currentUser.role} &bull; {currentUser.badgeNumber || 'Active'}
                </div>
              </div>
              <button
                onClick={logout}
                className="ml-2 px-2.5 py-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-700/60 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab switcher: Login Form vs Role Matrix */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-emerald-700 text-white shadow-subtle'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Portal Sign In
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-emerald-700 text-white shadow-subtle'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Role Permissions &amp; Access Matrix
          </button>
        </div>
      </div>

      {/* TAB 1: LOGIN PORTAL */}
      {activeTab === 'login' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Demo Accounts Directory (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-subtle">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>Four System Roles &bull; Demo Accounts</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Click any role below to automatically fill credentials and test role-specific features.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Demo Pass: <strong className="text-slate-900">*123</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoAccounts.map(acc => {
                  const isCurrent = currentUser?.role === acc.role && isAuthenticated;
                  return (
                    <div
                      key={acc.role}
                      className={`p-3.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${acc.color} ${
                        isCurrent ? 'ring-2 ring-emerald-600' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-white shadow-xs border border-slate-200">
                              {acc.icon}
                            </div>
                            <div>
                              <strong className="text-slate-900 font-bold block">{acc.role}</strong>
                              <span className="text-[10px] text-slate-500">{acc.badge}</span>
                            </div>
                          </div>
                          <Badge variant={acc.badgeVariant} size="xs">
                            {acc.role}
                          </Badge>
                        </div>

                        <div
                          onClick={() => handleFillCredentials(acc.email, acc.pass)}
                          className="bg-white/90 hover:bg-emerald-50/80 p-2 rounded border border-slate-200/70 font-mono text-[11px] space-y-1 mb-2.5 cursor-pointer transition-colors"
                          title="Click to autofill credentials"
                        >
                          <div className="text-slate-600 truncate flex items-center justify-between">
                            <span>User: <strong className="text-slate-900">{acc.email}</strong></span>
                            <span className="text-[9px] font-sans text-emerald-700 font-bold uppercase">Click to fill</span>
                          </div>
                          <div className="text-slate-600">
                            Pass: <strong className="text-slate-900">{acc.pass}</strong>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                          {acc.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleFillCredentials(acc.email, acc.pass)}
                          className="flex-1 py-1 px-2 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 text-[11px] text-center transition-colors cursor-pointer"
                        >
                          Fill Form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLoginAs(acc.role)}
                          className="flex-1 py-1 px-2 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] text-center transition-colors cursor-pointer shadow-xs"
                        >
                          Login &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-6 shadow-subtle">
            <div className="pb-4 mb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Portal Authentication</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your credentials or choose a demo account to access your workspace.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fade-in font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={e => setUsernameOrEmail(e.target.value)}
                    placeholder="e.g. admin@tgsrtc.gov.in or admin"
                    className="w-full pl-9 pr-3 py-2 rounded border border-slate-300 text-xs bg-slate-50/50 focus:bg-white text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2 rounded border border-slate-300 text-xs bg-slate-50/50 focus:bg-white text-slate-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                  <span>Remember session</span>
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer hover:underline">
                  Forgot credentials?
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded bg-[#0d6e52] hover:bg-[#0b5c44] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
              Need assistance? Contact <strong className="text-slate-700">TGSRTC Control Room: 1800-200-4599</strong>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ROLE PERMISSIONS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Specification</h2>
            <p className="text-xs text-slate-500">
              Every role in the Telangana Public Transport Tracking Portal has strict security clearance boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoAccounts.map(acc => (
              <div key={acc.role} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {acc.icon}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{acc.role}</h3>
                      <p className="text-[11px] text-slate-500">{acc.title}</p>
                    </div>
                  </div>
                  <Badge variant={acc.badgeVariant}>{acc.role}</Badge>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Assigned Persona:</span> {acc.name} ({acc.badge})
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                    Authorized Capabilities &amp; Permissions:
                  </span>
                  <ul className="space-y-1">
                    {acc.responsibilities.map((r, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
