import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { UserRole } from '../../types';
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
  FastForward,
  ChevronDown,
  UserCheck,
  Radio,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeScreen, setActiveScreen }) => {
  const {
    currentUser,
    switchRole,
    isSimulationRunning,
    setIsSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    resetToDefaults
  } = useTransit();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: UserRole[] = ['Admin', 'Transport Operator', 'Driver', 'Passenger'];

  const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
    Admin: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    'Transport Operator': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    Driver: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
    Passenger: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' }
  };

  const navItems = [
    { id: 'live-map', label: 'Live Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'routes', label: 'Timetables', icon: <Calendar className="w-4 h-4" /> },
    { id: 'feedback', label: 'Passenger Hub', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'reports', label: 'Mandatory Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'driver', label: 'Driver Cockpit', icon: <Bus className="w-4 h-4" />, roleRequired: 'Driver' },
    { id: 'operator', label: 'Operator Dispatch', icon: <Sliders className="w-4 h-4" />, roleRequired: 'Transport Operator' },
    { id: 'admin', label: 'Admin Ops', icon: <Shield className="w-4 h-4" />, roleRequired: 'Admin' },
    { id: 'auth', label: 'Roles & Auth', icon: <UserCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveScreen('live-map')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-transit-600 to-sky-400 flex items-center justify-center shadow-md shadow-transit-500/30 text-white">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  Metro<span className="text-transit-400">Transit</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-transit-500/20 text-transit-300 border border-transit-500/30">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  LIVE GPS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Public Transport Tracking &amp; Route Information Portal
              </p>
            </div>
          </div>

          {/* GPS Simulation Controls */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400 font-medium">GPS Simulation:</span>
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              className={`p-1.5 rounded-md font-semibold flex items-center gap-1 transition-all ${
                isSimulationRunning
                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
              }`}
              title={isSimulationRunning ? 'Pause GPS tracking simulation' : 'Resume GPS tracking'}
            >
              {isSimulationRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Running</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Paused</span>
                </>
              )}
            </button>
            <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-700">
              {[1, 2, 5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                    simulationSpeed === spd
                      ? 'bg-transit-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
            <button
              onClick={resetToDefaults}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1"
              title="Reset state to initial specs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role Switcher & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick 1-Click Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  roleColors[currentUser.role].bg
                } ${roleColors[currentUser.role].text} ${roleColors[currentUser.role].border}`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-ping-slow" />
                <span>Role: <strong className="font-bold">{currentUser.role}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 animate-fade-in"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Role (1-Click)
                  </div>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentUser.role === r ? 'bg-transit-50 text-transit-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            r === 'Admin'
                              ? 'bg-purple-500'
                              : r === 'Transport Operator'
                              ? 'bg-blue-500'
                              : r === 'Driver'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span>{r}</span>
                      </div>
                      {currentUser.role === r && (
                        <span className="text-[10px] bg-transit-100 text-transit-700 font-bold px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3 py-1">
                    <button
                      onClick={() => {
                        setActiveScreen('auth');
                        setRoleMenuOpen(false);
                      }}
                      className="text-[11px] text-transit-600 hover:text-transit-800 font-semibold flex items-center gap-1"
                    >
                      Manage Accounts &amp; Permissions &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div
              className="flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer"
              onClick={() => setActiveScreen('auth')}
              title={`Logged in as ${currentUser.name}`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 ring-2 ring-transit-500/20"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-medium text-slate-200 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {currentUser.badgeNumber || currentUser.role}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Horizontal Navigation Menu for 8 Screens */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {navItems.map(item => {
            const isActive = activeScreen === item.id;
            const isRoleSpecial = !!item.roleRequired;

            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-transit-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isRoleSpecial && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      isActive ? 'bg-transit-700 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.roleRequired}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
