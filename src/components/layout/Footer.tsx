import React from 'react';
import { Bus, ShieldCheck, Phone, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0c1a2e] border-t border-slate-800 text-slate-400 text-xs py-7 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-6 h-6 rounded bg-[#0d6e52] flex items-center justify-center text-white">
                <Bus className="w-3.5 h-3.5" />
              </div>
              <span>TGSRTC &bull; తెలంగాణ గమనం</span>
            </div>
            <p className="text-slate-400 text-[11.5px] leading-relaxed">
              Telangana State Road Transport Corporation. Real-time GPS vehicle tracking, timetable broadcasting, passenger feedback, and regulatory operational reports for Warangal &amp; Telangana regional corridors.
            </p>
            <div className="flex items-center gap-2 text-[10.5px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>5 Active Corridors &bull; Live Telemetry Feed (IST)</span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-2.5 uppercase tracking-wider text-[11px]">Regional Depots</h4>
            <ul className="space-y-1.5 text-slate-400 text-[11.5px]">
              <li>&bull; Warangal Depot-1 &amp; City Bus Station (CBS)</li>
              <li>&bull; Hanamkonda Central Bus Depot (HNK)</li>
              <li>&bull; Kazipet Railway Junction Transit Bay</li>
              <li>&bull; Jangaon, Karimnagar &amp; MGBS Hyderabad Terminals</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-2.5 uppercase tracking-wider text-[11px]">System Capabilities</h4>
            <ul className="space-y-1.5 text-slate-400 text-[11.5px]">
              <li>&bull; Real-time GPS Fleet Telemetry</li>
              <li>&bull; Route &amp; Stop GIS Mapping (Telangana)</li>
              <li>&bull; Point-to-Point Bus Route Finder</li>
              <li>&bull; 4 Mandatory Regulatory Reports (CSV / Print)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-2.5 uppercase tracking-wider text-[11px]">Support &amp; Control Room</h4>
            <div className="space-y-1.5 text-slate-400 text-[11.5px]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Toll-Free: <strong>1800-200-4599</strong> (24x7)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Warangal Regional Control Room: 0870-2445566</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Operating IST (UTC+5:30)</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p className="text-slate-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} TGSRTC &bull; Department of Transport, Government of Telangana. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Role-Based Access Control
            </span>
            <span>&bull;</span>
            <span>Telangana GIS Navigation v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
