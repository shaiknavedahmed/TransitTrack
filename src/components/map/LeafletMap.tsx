import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useTransit } from '../../context/TransitContext';
import { TransitVehicle, TransitStop, TransitRoute } from '../../types';

interface LeafletMapProps {
  onSelectVehicle?: (vehicle: TransitVehicle) => void;
  onSelectStop?: (stop: TransitStop) => void;
  selectedRouteId?: string | null;
  selectedVehicleId?: string | null;
  heightClass?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  onSelectVehicle,
  onSelectStop,
  selectedRouteId,
  selectedVehicleId,
  heightClass = 'h-[540px]'
}) => {
  const { routes, stops, vehicles } = useTransit();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on downtown coordinates (San Francisco area from mockData)
    const initialCenter: [number, number] = [37.7780, -122.4200];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | MetroTransit'
    }).addTo(map);

    const routesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    routesLayerRef.current = routesLayer;
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

  // Render Routes (Polylines)
  useEffect(() => {
    if (!routesLayerRef.current) return;
    const routesLayer = routesLayerRef.current;
    routesLayer.clearLayers();

    const routesToDisplay = selectedRouteId
      ? routes.filter(r => r.id === selectedRouteId)
      : routes.filter(r => r.isPublished);

    routesToDisplay.forEach(route => {
      const latlngs: [number, number][] = route.waypoints.map(wp => [wp.lat, wp.lng]);

      // Outer glow line
      L.polyline(latlngs, {
        color: route.color,
        weight: 7,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routesLayer);

      // Inner crisp line
      const polyline = L.polyline(latlngs, {
        color: route.color,
        weight: 4,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routesLayer);

      polyline.bindTooltip(
        `<strong>Route ${route.code}</strong>: ${route.name} (${route.mode})`,
        { sticky: true }
      );
    });
  }, [routes, selectedRouteId]);

  // Render Stops and Live Vehicles
  useEffect(() => {
    if (!markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    // 1. Render Stops
    const stopsToDisplay = selectedRouteId
      ? stops.filter(s => s.routesServed.includes(selectedRouteId))
      : stops;

    stopsToDisplay.forEach(stop => {
      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `
          <div style="
            width: 14px;
            height: 14px;
            background: #ffffff;
            border: 3px solid #006bc9;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([stop.location.lat, stop.location.lng], {
        icon: stopIcon,
        title: stop.name
      }).addTo(markersLayer);

      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 12px; padding: 2px 4px;">
          <strong>${stop.name}</strong> (${stop.code})<br/>
          <span style="color: #64748b; font-size: 10px;">${stop.zone}</span>
        </div>`,
        { direction: 'top', offset: [0, -8] }
      );

      marker.on('click', () => {
        if (onSelectStop) onSelectStop(stop);
      });
    });

    // 2. Render Live Moving Vehicles
    const vehiclesToDisplay = selectedRouteId
      ? vehicles.filter(v => v.assignedRouteId === selectedRouteId)
      : vehicles;

    vehiclesToDisplay.forEach(veh => {
      const isSelected = selectedVehicleId === veh.id;
      const route = routes.find(r => r.id === veh.assignedRouteId);
      const routeColor = route?.color || '#006bc9';
      const isDelayed = veh.delayMinutes > 3;

      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background-color: ${isSelected ? '#0c1524' : '#ffffff'};
            color: ${isSelected ? '#ffffff' : '#0c1524'};
            border: 2.5px solid ${routeColor};
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            font-family: sans-serif;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
          ">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span style="line-height: 1; font-size: 9px; font-weight: 800;">${route ? route.code : 'BUS'}</span>
              <span style="line-height: 1; font-size: 7px; color: ${isDelayed ? '#ef4444' : '#10b981'}; font-weight: 700;">
                ${isDelayed ? `+${veh.delayMinutes}m` : 'ON TIME'}
              </span>
            </div>
            ${
              veh.isSimulating
                ? `<span style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 10px;
                    height: 10px;
                    background-color: #10b981;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                  "></span>`
                : ''
            }
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const vehicleMarker = L.marker([veh.currentLocation.lat, veh.currentLocation.lng], {
        icon: vehicleIcon,
        zIndexOffset: isSelected ? 1000 : 500
      }).addTo(markersLayer);

      vehicleMarker.bindTooltip(
        `<div style="font-family: inherit; font-size: 12px; padding: 4px;">
          <div style="font-weight: bold; color: ${routeColor};">Route ${route?.code || ''} - ${veh.regNumber}</div>
          <div style="color: #334155; font-size: 11px;">Speed: ${veh.speedKmH} km/h &bull; Driver: ${veh.assignedDriverName || 'Auto'}</div>
          <div style="color: ${isDelayed ? '#b91c1c' : '#15803d'}; font-size: 10px; font-weight: 600;">
            ${isDelayed ? `Delayed: +${veh.delayMinutes} min` : 'Running On Schedule'} &bull; Occupancy: ${veh.occupancy} (${veh.occupancyPercent}%)
          </div>
        </div>`,
        { direction: 'top', offset: [0, -20] }
      );

      vehicleMarker.on('click', () => {
        if (onSelectVehicle) onSelectVehicle(veh);
      });
    });
  }, [vehicles, stops, routes, selectedRouteId, selectedVehicleId, onSelectVehicle, onSelectStop]);

  // Center on selected vehicle if changed
  useEffect(() => {
    if (!selectedVehicleId || !mapInstanceRef.current) return;
    const veh = vehicles.find(v => v.id === selectedVehicleId);
    if (veh) {
      mapInstanceRef.current.panTo([veh.currentLocation.lat, veh.currentLocation.lng], {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedVehicleId]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100`}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-xs hidden sm:block">
        <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Map Legend
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-transit-600 bg-white inline-block" />
            Stop Point
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-transit-600 text-[8px] text-white font-bold flex items-center justify-center">
              BUS
            </span>
            Live Vehicle
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-1 bg-transit-500 inline-block rounded" />
            Route Line
          </span>
        </div>
      </div>
    </div>
  );
};
