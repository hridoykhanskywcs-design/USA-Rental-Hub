import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PropertyListing } from '../types';
import { useApp } from '../context/AppContext';
import {
  Maximize2,
  Minimize2,
  Navigation,
  ShieldCheck,
  Bed,
  Bath,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  ExternalLink,
  Calendar
} from 'lucide-react';

interface InteractivePropertyMapProps {
  properties: PropertyListing[];
  selectedPropertyId?: string | null;
  onSelectProperty: (property: PropertyListing) => void;
  heightClass?: string;
  isSplitView?: boolean;
}

export const InteractivePropertyMap: React.FC<InteractivePropertyMapProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  heightClass = 'h-[520px]',
  isSplitView = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [activeProperty, setActiveProperty] = useState<PropertyListing | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'voyager'>('voyager');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const { setSelectedProperty, setApplyingProperty, setTouringProperty } = useApp();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid double initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: San Francisco or first property
    const defaultLat = properties[0]?.address?.latitude || 37.7749;
    const defaultLng = properties[0]?.address?.longitude || -122.4194;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Add zoom controls to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add attribution in discreet format
    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>')
      .addTo(map);

    mapInstanceRef.current = map;

    // Tile URLs
    const tileUrls = {
      voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    };

    tileLayerRef.current = L.tileLayer(tileUrls[mapStyle], {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrls = {
      voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    };

    tileLayerRef.current.setUrl(tileUrls[mapStyle]);
  }, [mapStyle]);

  // Update Markers when properties list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    (Object.values(markersRef.current) as L.Marker[]).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (properties.length === 0) return;

    const bounds = L.latLngBounds([]);

    properties.forEach((prop) => {
      const lat = prop.address?.latitude;
      const lng = prop.address?.longitude;
      if (!lat || !lng) return;

      bounds.extend([lat, lng]);

      const isSelected = selectedPropertyId === prop.id || activeProperty?.id === prop.id;

      // Custom HTML badge icon (Zillow / Redfin price pill style)
      const iconHtml = `
        <div class="group transform transition-all duration-200 cursor-pointer ${
          isSelected ? 'scale-110 z-50' : 'hover:scale-105 z-10'
        }">
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-colors border ${
            isSelected
              ? 'bg-teal-600 text-white border-teal-700 shadow-teal-500/30'
              : 'bg-white text-stone-900 border-stone-200 hover:border-teal-500 hover:text-teal-700'
          }">
            ${prop.isVerified ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>' : ''}
            <span>$${prop.rent.toLocaleString()}</span>
          </div>
          <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] mx-auto ${
            isSelected ? 'border-t-teal-700' : 'border-t-stone-300'
          }"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: iconHtml,
        iconSize: [68, 30],
        iconAnchor: [34, 30],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveProperty(prop);
        onSelectProperty(prop);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      markersRef.current[prop.id] = marker;
    });

    // Auto-fit bounds if we have coordinates
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [properties, selectedPropertyId, activeProperty?.id]);

  // Recenter map to bounds
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || properties.length === 0) return;

    const bounds = L.latLngBounds([]);
    properties.forEach((p) => {
      if (p.address?.latitude && p.address?.longitude) {
        bounds.extend([p.address.latitude, p.address.longitude]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  return (
    <div
      id="interactive-marketplace-map-container"
      className={`relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : heightClass
      }`}
    >
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-stone-100" />

      {/* Top Floating Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        {/* Style Selector */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-stone-200/80 flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setMapStyle('voyager')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              mapStyle === 'voyager'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Light View
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              mapStyle === 'streets'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            OpenStreetMap
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              mapStyle === 'satellite'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Recenter button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="bg-white/95 backdrop-blur-md text-stone-700 hover:text-teal-700 px-3 py-1.5 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-1.5 text-xs font-semibold hover:bg-stone-50 transition-all"
          title="Fit all listings in view"
        >
          <Navigation className="w-3.5 h-3.5 text-teal-600" />
          <span>Fit Properties ({properties.length})</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/95 backdrop-blur-md text-stone-700 hover:text-stone-900 p-2 rounded-xl shadow-md border border-stone-200/80 transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Property Card Popup */}
      {activeProperty && (
        <div
          id="active-map-property-card"
          className="absolute bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/90 z-20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
            <img
              src={activeProperty.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
              alt={activeProperty.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              {activeProperty.isVerified && (
                <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Home
                </span>
              )}
              {activeProperty.featured && (
                <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveProperty(null)}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center text-xs font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-xl font-extrabold text-stone-900">
                ${activeProperty.rent.toLocaleString()}
                <span className="text-xs font-normal text-stone-500"> /month</span>
              </div>
              <span className="text-xs text-stone-500 uppercase font-semibold">
                {activeProperty.propertyType}
              </span>
            </div>

            <h4 className="font-bold text-stone-900 text-sm line-clamp-1 mb-1.5">
              {activeProperty.title}
            </h4>

            <p className="text-xs text-stone-500 flex items-center gap-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">
                {activeProperty.address.street}, {activeProperty.address.city}, {activeProperty.address.state}
              </span>
            </p>

            <div className="flex items-center gap-4 text-xs text-stone-600 font-medium py-2 border-y border-stone-100 mb-3">
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-stone-400" />
                {activeProperty.bedrooms} Beds
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-stone-400" />
                {activeProperty.bathrooms} Baths
              </span>
              <span>{activeProperty.sqft.toLocaleString()} Sq Ft</span>
              {activeProperty.transitScores?.walkScore && (
                <span className="ml-auto text-[11px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                  {activeProperty.transitScores.walkScore} WalkScore
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedProperty(activeProperty);
                }}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setApplyingProperty(activeProperty);
                }}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Apply Online
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discreet Bottom Stats badge */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-stone-200/80 text-[11px] font-semibold text-stone-600 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        <span>Mapping {properties.length} Verified Properties</span>
      </div>
    </div>
  );
};
