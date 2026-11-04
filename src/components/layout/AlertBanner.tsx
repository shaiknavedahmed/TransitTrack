import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { AlertTriangle, Clock, ArrowRight, X } from 'lucide-react';

export const AlertBanner: React.FC<{ onNavigateToDelays?: () => void }> = ({ onNavigateToDelays }) => {
  const { delays } = useTransit();
  const [dismissed, setDismissed] = useState(false);

  const activeDelays = delays.filter(d => d.status === 'Active');

  if (activeDelays.length === 0 || dismissed) {
    return null;
  }

  const primaryDelay = activeDelays[0];

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600/30 flex items-center justify-between text-xs sm:text-sm font-medium shadow-inner transition-all">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-600/30 text-slate-950 font-bold uppercase text-[11px] shrink-0 tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          Transit Advisory
        </span>
        <div className="truncate flex items-center gap-2">
          <span className="font-bold underline decoration-amber-900/40">
            Route {primaryDelay.routeCode} ({primaryDelay.routeName}):
          </span>
          <span className="truncate">
            +{primaryDelay.delayMinutes} mins delay due to {primaryDelay.cause}.
          </span>
          {activeDelays.length > 1 && (
            <span className="text-amber-950 font-semibold shrink-0">
              (+{activeDelays.length - 1} more active delays)
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        {onNavigateToDelays && (
          <button
            onClick={onNavigateToDelays}
            className="flex items-center gap-1 text-xs font-bold underline hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer"
          >
            <span>View Alerts & History</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-amber-600/30 transition-colors"
          title="Dismiss advisory banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
