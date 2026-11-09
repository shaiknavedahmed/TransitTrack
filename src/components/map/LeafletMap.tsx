import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { useTransit } from '../../context/TransitContext';
import { TransitVehicle, TransitStop } from '../../types';
import {
  Maximize2,
  MapPin,
  Compass,
  Filter,
  Layers,
  Eye,
  EyeOff,
  RotateCcw,
  Bus,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';

interface LeafletMapProps {
  onSelectVehicle?: (vehicle: TransitVehicle) => void;
  onSelectStop?: (stop: TransitStop) => void;
  selectedRouteId?: string | null;
  selectedVehicleId?: string | null;
  heightClass?: string;
  initialFitAllBuses?: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  onSelectVehicle,
  onSelectStop,
  selectedRouteId,
  selectedVehicleId,
  heightClass = 'h-[540px]'
}) => {
  const { routes, stops, vehicles, isSimulationRunning } = useTransit();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const dispersionLinesLayerRef = useRef<L.LayerGroup | null>(null);

  // Map Filter & Display States
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'In Service' | 'Delayed' | 'Idle / Depot' | 'Maintenance'>('ALL');
  const [showStops, setShowStops] = useState(true);
  const [showAllBusesSimultaneously, setShowAllBusesSimultaneously] = useState(true);

  // 1. Initialize Map with Warangal, Telangana, India as default center
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Warangal Tri-City (Warangal - Hanamkonda - Kazipet), Telangana, India
    const warangalCenter: [number, number] = [17.9784, 79.5941];
    const map = L.map(mapContainerRef.current, {
      center: warangalCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Clear, accessible OpenStreetMap tiles with high clarity
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | TGSRTC Telangana State Road Transport'
    }).addTo(map);

    const routesLayer = L.layerGroup().addTo(map);
    const dispersionLinesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    routesLayerRef.current = routesLayer;
    dispersionLinesLayerRef.current = dispersionLinesLayer;
    markersLayerRef.current = markersLayer;

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Routes (Polylines)
  useEffect(() => {
    if (!routesLayerRef.current || !mapInstanceRef.current) return;
    const routesLayer = routesLayerRef.current;
    routesLayer.clearLayers();

    const routesToDisplay = selectedRouteId
      ? routes.filter(r => r.id === selectedRouteId)
      : routes.filter(r => r.isPublished);

    routesToDisplay.forEach(route => {
      const latlngs: [number, number][] = route.waypoints.map(wp => [wp.lat, wp.lng]);
      const isSelected = selectedRouteId === route.id;

      // Outer casing line
      L.polyline(latlngs, {
        color: route.color,
        weight: isSelected ? 8 : 5,
        opacity: isSelected ? 0.35 : 0.2,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routesLayer);

      // Inner crisp solid line
      const polyline = L.polyline(latlngs, {
        color: route.color,
        weight: isSelected ? 4 : 3,
        opacity: isSelected ? 1 : 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routesLayer);

      polyline.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; padding: 2px 4px;">
          <strong>Line ${route.code}</strong>: ${route.name}<br/>
          <span style="color: #64748b;">${route.teluguName || ''}</span>
        </div>`,
        { sticky: true }
      );
    });
  }, [routes, selectedRouteId]);

  // 3. Filter vehicles to display based on statusFilter and route selection
  const eligibleVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Must have valid coordinates
      if (!v.currentLocation || typeof v.currentLocation.lat !== 'number' || typeof v.currentLocation.lng !== 'number') {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'Delayed' && v.status !== 'Delayed' && v.delayMinutes <= 3) return false;
        if (statusFilter !== 'Delayed' && v.status !== statusFilter) return false;
      }

      // If user toggles off "showAllBusesSimultaneously" AND a route is selected, filter by route
      if (!showAllBusesSimultaneously && selectedRouteId && v.assignedRouteId !== selectedRouteId) {
        return false;
      }

      return true;
    });
  }, [vehicles, statusFilter, showAllBusesSimultaneously, selectedRouteId]);

  // 4. Overlap Prevention / Spiderfy Dispersion Algorithm
  // If multiple vehicles are at or near the exact same location (< 0.002 deg, ~150m), disperse them radially
  const dispersedVehicles = useMemo(() => {
    interface DispersedVehicle {
      vehicle: TransitVehicle;
      renderLat: number;
      renderLng: number;
      isDispersed: boolean;
      baseLat: number;
      baseLng: number;
    }

    const proximityThreshold = 0.0018; // ~130 meters
    const clusters: TransitVehicle[][] = [];

    eligibleVehicles.forEach(veh => {
      let placed = false;
      for (const cluster of clusters) {
        const first = cluster[0];
        const dist = Math.hypot(
          veh.currentLocation.lat - first.currentLocation.lat,
          veh.currentLocation.lng - first.currentLocation.lng
        );
        if (dist < proximityThreshold) {
          cluster.push(veh);
          placed = true;
          break;
        }
      }
      if (!placed) {
        clusters.push([veh]);
      }
    });

    const result: DispersedVehicle[] = [];

    clusters.forEach(cluster => {
      if (cluster.length === 1) {
        result.push({
          vehicle: cluster[0],
          renderLat: cluster[0].currentLocation.lat,
          renderLng: cluster[0].currentLocation.lng,
          isDispersed: false,
          baseLat: cluster[0].currentLocation.lat,
          baseLng: cluster[0].currentLocation.lng
        });
      } else {
        const centerLat = cluster[0].currentLocation.lat;
        const centerLng = cluster[0].currentLocation.lng;
        const radius = 0.0016; // ~120 meters offset

        cluster.forEach((v, idx) => {
          const angle = (2 * Math.PI * idx) / cluster.length;
          const rLat = centerLat + radius * Math.sin(angle);
          const rLng = centerLng + (radius * Math.cos(angle)) / Math.cos((centerLat * Math.PI) / 180);

          result.push({
            vehicle: v,
            renderLat: rLat,
            renderLng: rLng,
            isDispersed: true,
            baseLat: centerLat,
            baseLng: centerLng
          });
        });
      }
    });

    return result;
  }, [eligibleVehicles]);

  // 5. Render Stops and Live Vehicles with Overlap Prevention
  useEffect(() => {
    if (!markersLayerRef.current || !dispersionLinesLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    const dispersionLinesLayer = dispersionLinesLayerRef.current;
    markersLayer.clearLayers();
    dispersionLinesLayer.clearLayers();

    // Render Stops (if toggled on)
    if (showStops) {
      const stopsToDisplay = selectedRouteId
        ? stops.filter(s => s.routesServed.includes(selectedRouteId))
        : stops;

      stopsToDisplay.forEach(stop => {
        const stopIcon = L.divIcon({
          className: 'custom-stop-marker',
          html: `
            <div style="
              width: 12px;
              height: 12px;
              background: #ffffff;
              border: 2.5px solid #0f223d;
              border-radius: 50%;
              box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              cursor: pointer;
            "></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const marker = L.marker([stop.location.lat, stop.location.lng], {
          icon: stopIcon,
          title: stop.name
        }).addTo(markersLayer);

        marker.bindTooltip(
          `<div style="font-family: inherit; font-size: 11.5px; padding: 2px 4px; line-height: 1.3;">
            <div style="font-weight: 700; color: #0f172a;">${stop.name}</div>
            ${stop.teluguName ? `<div style="font-size: 10.5px; color: #0d6e52; font-weight: 600;">${stop.teluguName}</div>` : ''}
            <div style="color: #64748b; font-size: 9.5px; margin-top: 1px;">${stop.zone} &bull; Code: ${stop.code}</div>
          </div>`,
          { direction: 'top', offset: [0, -6] }
        );

        marker.on('click', () => {
          if (onSelectStop) onSelectStop(stop);
        });
      });
    }

    // Render Dispersed Vehicle Markers & Connectors
    dispersedVehicles.forEach(item => {
      const { vehicle: veh, renderLat, renderLng, isDispersed, baseLat, baseLng } = item;
      const isSelected = selectedVehicleId === veh.id;
      const route = routes.find(r => r.id === veh.assignedRouteId);
      const isRouteSelected = selectedRouteId && veh.assignedRouteId === selectedRouteId;
      const routeColor = route?.color || '#0d6e52';
      const isDelayed = veh.delayMinutes > 3 || veh.status === 'Delayed';
      const isInMaintenance = veh.status === 'Maintenance';
      const isIdle = veh.status === 'Idle / Depot' || veh.status === 'Off Duty';

      // Draw dashed connector line if dispersed from a cluster
      if (isDispersed) {
        L.polyline([[baseLat, baseLng], [renderLat, renderLng]], {
          color: '#64748b',
          weight: 1.5,
          dashArray: '2, 4',
          opacity: 0.65
        }).addTo(dispersionLinesLayer);

        // Tiny base center anchor dot
        L.circleMarker([baseLat, baseLng], {
          radius: 2.5,
          fillColor: '#0f223d',
          color: '#ffffff',
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.9
        }).addTo(dispersionLinesLayer);
      }

      // Marker badge design
      const badgeBg = isSelected
        ? '#0f223d'
        : isInMaintenance
        ? '#fef2f2'
        : isIdle
        ? '#f8fafc'
        : '#ffffff';

      const badgeTextColor = isSelected ? '#ffffff' : '#0f223d';
      const borderColor = isInMaintenance ? '#dc2626' : isDelayed ? '#d97706' : routeColor;

      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 30px;
            background-color: ${badgeBg};
            color: ${badgeTextColor};
            border: ${isSelected ? '2.5px solid #10b981' : isRouteSelected ? `2.5px solid ${borderColor}` : `2px solid ${borderColor}`};
            border-radius: 7px;
            box-shadow: ${isSelected ? '0 0 0 3px rgba(16, 185, 129, 0.4), 0 4px 10px rgba(0,0,0,0.3)' : '0 2px 7px rgba(0,0,0,0.22)'};
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="display: flex; flex-direction: column; align-items: center; line-height: 1.05;">
              <span style="font-size: 10px; font-weight: 800; letter-spacing: -0.3px;">
                ${route ? `L-${route.code}` : isInMaintenance ? 'MAINT' : 'DEPOT'}
              </span>
              <span style="font-size: 7.5px; font-weight: 700; color: ${
                isInMaintenance ? '#dc2626' : isDelayed ? '#d97706' : isSelected ? '#34d399' : '#059669'
              }; font-family: monospace;">
                ${isInMaintenance ? 'SERVICE' : isDelayed ? `+${veh.delayMinutes}m` : `${veh.speedKmH}km/h`}
              </span>
            </div>
            ${
              veh.isSimulating
                ? `<span style="
                    position: absolute;
                    top: -3.5px;
                    right: -3.5px;
                    width: 8px;
                    height: 8px;
                    background-color: #10b981;
                    border: 1.5px solid #ffffff;
                    border-radius: 50%;
                  "></span>`
                : ''
            }
          </div>
        `,
        iconSize: [48, 30],
        iconAnchor: [24, 15]
      });

      const vehicleMarker = L.marker([renderLat, renderLng], {
        icon: vehicleIcon,
        zIndexOffset: isSelected ? 1500 : isRouteSelected ? 1000 : 500
      }).addTo(markersLayer);

      vehicleMarker.bindTooltip(
        `<div style="font-family: inherit; font-size: 12px; padding: 4px; line-height: 1.35; min-width: 170px;">
          <div style="font-weight: 700; color: ${borderColor}; font-size: 12.5px;">
            ${route ? `Line ${route.code} &bull; ` : ''}${veh.regNumber}
          </div>
          <div style="color: #334155; font-size: 11px;">${veh.model}</div>
          <div style="color: #475569; font-size: 10.5px; margin-top: 1px;">
            Depot: <strong>${veh.depot}</strong>
          </div>
          <div style="color: #475569; font-size: 10.5px;">
            Speed: <strong>${veh.speedKmH} km/h</strong> &bull; Driver: <strong>${veh.assignedDriverName || 'Auto/Spare'}</strong>
          </div>
          <div style="color: ${isInMaintenance ? '#b91c1c' : isDelayed ? '#b91c1c' : '#15803d'}; font-size: 10.5px; font-weight: 600; margin-top: 2px;">
            Status: ${veh.status} ${isDelayed ? `(+${veh.delayMinutes}m delay)` : ''}
          </div>
          <div style="color: #64748b; font-size: 9.5px; margin-top: 2px; font-family: monospace;">
            GPS: ${veh.currentLocation.lat.toFixed(4)}, ${veh.currentLocation.lng.toFixed(4)}
          </div>
        </div>`,
        { direction: 'top', offset: [0, -16] }
      );

      vehicleMarker.on('click', () => {
        if (onSelectVehicle) onSelectVehicle(veh);
      });
    });
  }, [dispersedVehicles, stops, routes, selectedRouteId, selectedVehicleId, showStops, onSelectVehicle, onSelectStop]);

  // Center on selected vehicle if changed
  useEffect(() => {
    if (!selectedVehicleId || !mapInstanceRef.current) return;
    const veh = vehicles.find(v => v.id === selectedVehicleId);
    if (veh && veh.currentLocation) {
      mapInstanceRef.current.panTo([veh.currentLocation.lat, veh.currentLocation.lng], {
        animate: true,
        duration: 0.6
      });
    }
  }, [selectedVehicleId, vehicles]);

  // Map Camera Control Actions
  const handleFitAllBuses = () => {
    if (!mapInstanceRef.current) return;
    const valid = vehicles.filter(
      v => v.currentLocation && typeof v.currentLocation.lat === 'number' && typeof v.currentLocation.lng === 'number'
    );
    if (valid.length === 0) return;

    const latlngs = valid.map(v => [v.currentLocation.lat, v.currentLocation.lng] as [number, number]);
    const bounds = L.latLngBounds(latlngs);
    mapInstanceRef.current.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15
    });
  };

  const handleFocusWarangalHub = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([17.9784, 79.5941], 13, {
      animate: true
    });
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-slate-100 flex flex-col`}>
      
      {/* Top Map Action Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Actions: Fit All Buses & Warangal Hub Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleFitAllBuses}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0f223d] hover:bg-slate-800 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            title="Fit viewport to show all buses across Telangana simultaneously"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fit All Buses ({eligibleVehicles.length})</span>
          </button>

          <button
            type="button"
            onClick={handleFocusWarangalHub}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 shadow-md flex items-center gap-1.5 transition-all cursor-pointer border border-slate-300"
            title="Focus camera on Warangal, Hanamkonda & Kazipet Tri-City center"
          >
            <Compass className="w-3.5 h-3.5 text-[#0d6e52]" />
            <span className="hidden sm:inline">Warangal Hub</span>
          </button>
        </div>

        {/* Right Actions: Filters & Toggle Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap">
          
          {/* Status Filter Dropdown */}
          <div className="flex items-center bg-white/95 rounded-lg border border-slate-300 shadow-sm px-2 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Fleet ({vehicles.length})</option>
              <option value="In Service">In Service Only</option>
              <option value="Delayed">Delayed Only</option>
              <option value="Idle / Depot">Depot / Idle</option>
              <option value="Maintenance">Depot Maintenance</option>
            </select>
          </div>

          {/* Toggle Stops */}
          <button
            type="button"
            onClick={() => setShowStops(!showStops)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition-all cursor-pointer border ${
              showStops
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                : 'bg-slate-200 text-slate-500 border-slate-300'
            }`}
            title="Toggle visibility of bus stop stations"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden md:inline">Stops</span>
          </button>

          {/* Toggle Show All Buses vs Selected Corridor Only */}
          {selectedRouteId && (
            <button
              type="button"
              onClick={() => setShowAllBusesSimultaneously(!showAllBusesSimultaneously)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition-all cursor-pointer border ${
                showAllBusesSimultaneously
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
              title="Toggle whether all fleet buses remain visible when corridor is selected"
            >
              <Bus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {showAllBusesSimultaneously ? 'All Buses Visible' : 'Corridor Buses Only'}
              </span>
            </button>
          )}

          {/* Live Telemetry Beacon */}
          <div className="bg-[#091526]/90 backdrop-blur-xs text-white rounded-lg px-2.5 py-1 text-[11px] font-bold border border-slate-700 shadow-sm flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="hidden lg:inline text-slate-300">GPS Engine:</span>
            <span className="text-emerald-400">{isSimulationRunning ? 'Live IST' : 'Paused'}</span>
          </div>

        </div>

      </div>

      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Regional Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 border border-slate-300 rounded-lg p-2.5 shadow-sm text-xs hidden sm:block max-w-sm">
        <div className="font-bold text-slate-800 text-[11px] mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            TGSRTC Warangal &amp; Telangana Regional Network
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-normal">
            {eligibleVehicles.length} of {vehicles.length} Units Visible
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10.5px] text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-800 bg-white inline-block" />
            Bus Stop
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-2.5 rounded bg-emerald-800 text-[8px] text-white font-bold flex items-center justify-center">
              BUS
            </span>
            Live Moving Bus
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-1 bg-emerald-700 inline-block rounded" />
            Corridor Route
          </span>
        </div>
      </div>

    </div>
  );
};
