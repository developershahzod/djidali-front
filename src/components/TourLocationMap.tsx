import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Custom branded marker icon - circle with brand color
const createBrandedIcon = () => {
  return L.divIcon({
    className: "custom-tour-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: #8B7355;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(139, 115, 85, 0.4);
      "></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to center map on coordinates
function MapCenterController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

interface TourLocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

/**
 * Display-only map component with custom branded pin
 * Uses Leaflet for custom marker styling
 */
export function TourLocationMap({
  latitude,
  longitude,
  zoom = 14,
  className = "",
}: TourLocationMapProps) {
  const center: [number, number] = [latitude, longitude];
  const brandedIcon = React.useMemo(() => createBrandedIcon(), []);

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
        style={{ height: "100%", width: "100%", borderRadius: "20px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={brandedIcon} />
        <MapCenterController center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}

export default TourLocationMap;
