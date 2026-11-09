import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { AlertTriangle, ArrowRight, X, Radio } from 'lucide-react';

export const AlertBanner: React.FC<{ onNavigateToDelays?: () => void }> = ({ onNavigateToDelays }) => {
  const { delays } = useTransit();
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const activeDelays = delays.filter(d => d.status === 'Active');

  if (activeDelays.length === 0) {
    return null;
  }

  // Display the most recent active delay that hasn't been explicitly dismissed
  const visibleDelay = activeDelays.find(d => d.id !== dismissedId) || (dismissedId === null ? activeDelays[0] : null);

  if (!visibleDelay) {
    return null;
  }

  const isCritical = visibleDelay.severity === 'Critical' || visibleDelay.severity === 'High';

  return (
    <div
      className={`px-4 py-2 border-b flex items-center justify-between text-xs sm:text-sm font-medium transition-all ${
        isCritical
          ? 'bg-rose-600 text-white border-rose-700 shadow-md'
          : 'bg-amber-500 text-slate-950 border-amber-600/30'
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
            isCritical ? 'bg-rose-950 text-rose-200 border border-rose-400/40' : 'bg-amber-600/30 text-slate-950 font-bold'
          }`}
        >
          {visibleDelay.reportedByRole === 'Admin' ? (
            <>
              <Radio className="w-3 h-3 animate-pulse text-rose-300" />
              <span>NETWORK BROADCAST</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3" />
              <span>SERVICE ADVISORY</span>
            </>
          )}
        </span>

        <div className="truncate flex items-center gap-2 text-xs">
          <span className="font-bold underline">
            Line {visibleDelay.routeCode} ({visibleDelay.routeName}):
          </span>
          <span className="truncate">
            {visibleDelay.actionTaken
              ? visibleDelay.actionTaken
              : `+${visibleDelay.delayMinutes} mins delay due to ${visibleDelay.cause}.`}
          </span>
          {activeDelays.length > 1 && (
            <span className={`text-[10.5px] font-mono shrink-0 ${isCritical ? 'text-rose-200' : 'text-amber-950 font-bold'}`}>
              (+{activeDelays.length - 1} more active)
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        {onNavigateToDelays && (
          <button
            onClick={onNavigateToDelays}
            className={`flex items-center gap-1 text-xs font-bold underline transition-opacity whitespace-nowrap cursor-pointer ${
              isCritical ? 'text-white hover:text-rose-200' : 'text-slate-950 hover:text-amber-900'
            }`}
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => setDismissedId(visibleDelay.id)}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isCritical ? 'hover:bg-rose-700 text-rose-200' : 'hover:bg-amber-600/30 text-slate-900'
          }`}
          title="Dismiss advisory"
          aria-label="Dismiss advisory"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
