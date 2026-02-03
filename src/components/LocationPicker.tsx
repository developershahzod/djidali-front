import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet with bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Default center: Uzbekistan (Tashkent)
const defaultCenter: [number, number] = [41.2995, 69.2401];

interface LocationPickerProps {
  value: {
    destination: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  onChange: (location: {
    destination: string;
    latitude: number | null;
    longitude: number | null;
  }) => void;
  placeholder?: string;
  label?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to recenter map when marker changes
const MapRecenter: React.FC<{ position: [number, number] | null }> = ({
  position,
}) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Введите название места...",
  label = "Место назначения",
}) => {
  const [searchQuery, setSearchQuery] = useState(value.destination);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    value.latitude && value.longitude
      ? [value.latitude, value.longitude]
      : null,
  );
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Update marker when value changes externally
  useEffect(() => {
    if (value.latitude && value.longitude) {
      setMarkerPosition([value.latitude, value.longitude]);
    }
    setSearchQuery(value.destination);
  }, [value.latitude, value.longitude, value.destination]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search using Nominatim (OpenStreetMap)
  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query,
            format: "json",
            limit: "5",
            countrycodes: "uz,kz,kg,tj,tm", // Central Asia focus
            addressdetails: "1",
          }),
        {
          headers: {
            "Accept-Language": "ru,en",
          },
        },
      );
      const data: NominatimResult[] = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 500);
  };

  const handleResultSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setMarkerPosition([lat, lng]);
    setSearchQuery(result.display_name);
    setShowResults(false);

    onChange({
      destination: result.display_name,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setMarkerPosition([lat, lng]);

      // Reverse geocode using Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?` +
            new URLSearchParams({
              lat: lat.toString(),
              lon: lng.toString(),
              format: "json",
            }),
          {
            headers: {
              "Accept-Language": "ru,en",
            },
          },
        );
        const data = await response.json();
        const address =
          data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        setSearchQuery(address);
        onChange({
          destination: address,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        // Fallback to coordinates if reverse geocoding fails
        const coordString = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setSearchQuery(coordString);
        onChange({
          destination: coordString,
          latitude: lat,
          longitude: lng,
        });
      }
    },
    [onChange],
  );

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setMarkerPosition(null);
    onChange({
      destination: "",
      latitude: null,
      longitude: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div ref={wrapperRef}>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          {label}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            placeholder={placeholder}
            className="h-12 text-lg pl-10 pr-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {isSearching && (
            <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" />
          )}

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() => handleResultSelect(result)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex items-start gap-3"
                >
                  <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 line-clamp-2">
                    {result.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Начните вводить для поиска или кликните на карту
        </p>
      </div>

      {/* Interactive Map */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200">
        <MapContainer
          center={markerPosition || defaultCenter}
          zoom={markerPosition ? 14 : 6}
          style={{ height: "300px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleMapClick} />
          <MapRecenter position={markerPosition} />
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  handleMapClick(position.lat, position.lng);
                },
              }}
            />
          )}
        </MapContainer>

        {/* Coordinates Display */}
        {markerPosition && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs z-[1000]">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>
                {markerPosition[0].toFixed(5)}, {markerPosition[1].toFixed(5)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-rose-500 rounded-full" />
          <span>Кликните на карту для выбора точки</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span>Перетащите маркер для корректировки</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
