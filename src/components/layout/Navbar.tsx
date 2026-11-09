import React, { useState, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { UserRole } from '../../types';
import { ROLE_DEFAULT_SCREEN, ROLE_LABELS } from '../../utils/roleConfig';
import {
  Bus,
  MapPin,
  Calendar,
  MessageSquare,
  Shield,
  Sliders,
  FileSpreadsheet,
  Play,
  Pause,
  ChevronDown,
  UserCheck,
  Radio,
  RotateCcw,
  Clock,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

const ROLE_NAV_ITEMS: Record<
  UserRole,
  { id: string; label: string; icon: React.ReactNode; badge?: string }[]
> = {
  Admin: [
    { id: 'admin', label: 'Command Center', icon: <Shield className="w-3.5 h-3.5" />, badge: 'Admin' },
    { id: 'reports', label: 'Mandatory Reports', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'live-map', label: 'Fleet Telemetry Map', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'operator', label: 'Dispatcher Hub', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'routes', label: 'Timetables & Fares', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Grievance Redressal', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'auth', label: 'Staff & Roles Matrix', icon: <UserCheck className="w-3.5 h-3.5" /> },
  ],
  'Transport Operator': [
    { id: 'operator', label: 'Operations Dispatch', icon: <Sliders className="w-3.5 h-3.5" />, badge: 'Operator' },
    { id: 'live-map', label: 'Corridor Live Map', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'routes', label: 'Routes & Timetables', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'reports', label: 'Operational Reports', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Passenger Complaints', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'auth', label: 'Operator Profile', icon: <UserCheck className="w-3.5 h-3.5" /> },
  ],
  Driver: [
    { id: 'driver', label: 'Driver Cockpit (Active Shift)', icon: <Bus className="w-3.5 h-3.5" />, badge: 'Driver' },
    { id: 'live-map', label: 'Assigned Route Radar', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Traffic Delays & Alerts', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'auth', label: 'Duty Log & ID', icon: <UserCheck className="w-3.5 h-3.5" /> },
  ],
  Passenger: [
    { id: 'live-map', label: 'Find Bus & Live Map', icon: <MapPin className="w-3.5 h-3.5" />, badge: 'Passenger' },
    { id: 'routes', label: 'Bus Timetables & Fares (₹)', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Grievance / Feedback', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'auth', label: 'Commuter Profile', icon: <UserCheck className="w-3.5 h-3.5" /> },
  ]
};

export const Navbar: React.FC<NavbarProps> = ({ activeScreen, setActiveScreen }) => {
  const {
    currentUser,
    logout,
    isSimulationRunning,
    setIsSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    resetToDefaults
  } = useTransit();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Live IST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTimeStr(new Intl.DateTimeFormat('en-IN', options).format(now));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentNavItems = ROLE_NAV_ITEMS[currentUser.role] || ROLE_NAV_ITEMS.Passenger;

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
  };

  const getRoleBadgeStyle = (r: UserRole) => {
    switch (r) {
      case 'Admin':
        return 'bg-purple-900/60 text-purple-200 border-purple-500/40';
      case 'Transport Operator':
        return 'bg-blue-900/60 text-blue-200 border-blue-500/40';
      case 'Driver':
        return 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40';
      case 'Passenger':
        return 'bg-amber-900/60 text-amber-200 border-amber-500/40';
    }
  };

  return (
    <header className="bg-[#091526] border-b border-slate-800 text-white sticky top-0 z-40 shadow-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16">
          
          {/* Official TGSRTC Brand Entity */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setActiveScreen(ROLE_DEFAULT_SCREEN[currentUser.role])}
          >
            <div className="w-9 h-9 rounded bg-[#0d6e52] border border-emerald-400/40 flex items-center justify-center text-white shadow-subtle group-hover:bg-[#0b5c44] transition-colors">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>TGSRTC</span>
                  <span className="text-emerald-400 font-normal text-xs sm:text-sm">| తెలంగాణ గమనం</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-600/50">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  LIVE GPS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block tracking-wide">
                Warangal &amp; Telangana State Integrated Public Transport Portal
              </p>
            </div>
          </div>

          {/* Operational IST Clock & Simulation Controls */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded bg-slate-900/90 border border-slate-800 text-xs">
            {/* Live IST Clock */}
            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentTimeStr || 'IST (UTC+5:30)'}</span>
              <span className="text-[9px] text-slate-500 uppercase">IST</span>
            </div>

            <div className="h-3 w-px bg-slate-700" />

            {/* GPS Simulation Toggle */}
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              className={`px-2 py-0.5 rounded font-mono font-bold text-[10.5px] flex items-center gap-1 transition-all cursor-pointer ${
                isSimulationRunning
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                  : 'bg-rose-950 text-rose-300 border border-rose-700/60'
              }`}
              title={isSimulationRunning ? 'Pause live GPS simulation engine' : 'Resume live GPS simulation engine'}
            >
              {isSimulationRunning ? (
                <>
                  <Pause className="w-2.5 h-2.5" />
                  <span>GPS Active</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5" />
                  <span>Paused</span>
                </>
              )}
            </button>

            {/* Speed multipliers */}
            <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800">
              {[1, 2, 5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer ${
                    simulationSpeed === spd
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${spd}x simulation speed`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Reset to defaults */}
            <button
              onClick={resetToDefaults}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset databases to initial Telangana transit data"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Right Action: Authenticated User Profile & Logout */}
          <div className="flex items-center gap-2.5">
            
            {/* Authenticated User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer text-left"
                aria-expanded={profileMenuOpen}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-600 shrink-0"
                />
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-xs font-bold text-slate-100 max-w-[130px] truncate">
                      {currentUser.name}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                    {currentUser.badgeNumber || currentUser.depot || currentUser.email}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Profile / Account Dropdown Menu */}
              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-xl border border-slate-200 py-2 z-50 text-slate-900 animate-fade-in"
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  {/* Account Header */}
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                        {currentUser.role}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {currentUser.badgeNumber || 'Verified Account'}
                      </span>
                    </div>
                  </div>

                  {/* Authenticated Session Details (Strict Access Control) */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Depot / Base:</span>
                      <strong className="text-slate-800">{currentUser.depot || 'Warangal Region'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Clearance:</span>
                      <span className="font-mono text-emerald-800 font-bold">Authorized Session</span>
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 leading-relaxed">
                      Role profiles are strictly partitioned. To access another role, you must sign out first.
                    </p>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-slate-100 pt-1.5 px-3">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Log Out</span>
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">Exit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 md:hidden cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Role-Specific Navigation Menu (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-800/80">
          {currentNavItems.map(item => {
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0d6e52] text-white shadow-subtle'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                      isActive ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-slate-800 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{currentUser.role} Workspace</span>
              <button onClick={handleLogout} className="text-rose-400 text-[10px] font-bold">
                Sign Out
              </button>
            </div>
            {currentNavItems.map(item => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors ${
                    isActive ? 'bg-[#0d6e52] text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
