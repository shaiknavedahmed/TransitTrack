import React from 'react';
import { Bus, ShieldCheck, Heart, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-transit-600 flex items-center justify-center text-white">
                <Bus className="w-4 h-4" />
              </div>
              <span>MetroTransit Portal</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Standardized metropolitan public transport fleet tracking, live GPS monitoring, timetable broadcasting, and transit operations authority.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow"></span>
              <span>All 4 Corridors Operational &bull; 99.8% GPS Sync</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">System Capabilities</h4>
            <ul className="space-y-2 text-slate-400">
              <li>&bull; Real-time GPS Fleet Telemetry</li>
              <li>&bull; Route &amp; Stop Geographic Mapping</li>
              <li>&bull; Automated Timetable Publishing</li>
              <li>&bull; Live Passenger Delay Broadcasting</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">User Roles</h4>
            <ul className="space-y-2 text-slate-400">
              <li>&bull; <strong>Admin:</strong> Master authority &amp; audits</li>
              <li>&bull; <strong>Transport Operator:</strong> Fleet &amp; routes</li>
              <li>&bull; <strong>Driver:</strong> Cockpit &amp; GPS broadcaster</li>
              <li>&bull; <strong>Passenger:</strong> Live tracking &amp; feedback</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Official Reports</h4>
            <ul className="space-y-2 text-slate-400">
              <li>&bull; Route-wise Schedule Report</li>
              <li>&bull; Vehicle Activity Report</li>
              <li>&bull; Passenger Feedback Report</li>
              <li>&bull; Service Delay Report</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Metro Transit Authority. DevOps Capstone Project. Built for high reliability and accessibility.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-transit-400" />
              Role-Based Access Control
            </span>
            <span>&bull;</span>
            <span>GPS Simulation Engine v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
