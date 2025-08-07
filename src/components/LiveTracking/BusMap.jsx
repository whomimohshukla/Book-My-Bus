import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketProvider.jsx";
import L from "leaflet";

// Default marker icon fix for leaflet in React (vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_POSITION = [20.5937, 78.9629]; // India centre

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position]);
  return null;
}

export default function BusMap({ initialCoords = null, startCoords=null, endCoords=null, speed=null, eta=null, nextStop=null, status="ON_TIME" }) {
  const socket = useSocket();
  const [position, setPosition] = useState(() => {
    if (initialCoords && initialCoords.length === 2) {
      const latNum = Number(initialCoords[1]);
      const lonNum = Number(initialCoords[0]);
      if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) return [latNum, lonNum];
    }
    return null;
  });

  useEffect(() => {
    if (!socket) return;
    const handler = ({ coordinates }) => {
      // coordinates = [lng, lat]
      const latNum = Number(coordinates[1]);
      const lonNum = Number(coordinates[0]);
      if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) {
        setPosition([latNum, lonNum]);
      }
    };
    socket.on("LOCATION_UPDATE", handler);
    return () => socket.off("LOCATION_UPDATE", handler);
  }, [socket]);

  // Update position if initialCoords prop changes (e.g., first fetch)
  useEffect(() => {
    if (initialCoords && initialCoords.length === 2) {
      const latNum = Number(initialCoords[1]);
      const lonNum = Number(initialCoords[0]);
      if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) setPosition([latNum, lonNum]);
    }
  }, [initialCoords]);

  return (
    <MapContainer
      center={position || DEFAULT_POSITION}
      zoom={5}
      scrollWheelZoom
      className="w-full h-[60vh] sm:h-[500px] rounded-lg shadow z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Start marker */}
      {startCoords && startCoords.length === 2 && (
        <Marker position={[startCoords[1], startCoords[0]]} icon={L.divIcon({ html: "<div style='color:#16a34a;font-size:22px;'>📍</div>", className: "", iconSize:[24,24], iconAnchor:[12,24] })}>
          <Popup>Boarding Point</Popup>
        </Marker>
      )}
      {/* Destination marker */}
      {endCoords && endCoords.length === 2 && (
        <Marker position={[endCoords[1], endCoords[0]]} icon={L.divIcon({ html: "<div style='color:#dc2626;font-size:22px;'>📍</div>", className: "", iconSize:[24,24], iconAnchor:[12,24] })}>
          <Popup>Destination</Popup>
        </Marker>
      )}
      {position && (
        <>
          <Marker 
            position={position} 
            icon={(() => {
              const color = status === "ARRIVING_SOON" || Number(speed) === 0 ? "#e11d48" : "#15803d";
              return L.divIcon({
                html: `<div style='display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:${color};font-size:20px;'>🚌</div>`,
                className: "bus-icon",
                iconSize: [32,32],
                iconAnchor: [16,16]
              });
            })()}
          >
            <Popup minWidth={180}>
              <div class="text-sm">
                <p><strong>Status:</strong> {status}</p>
                {speed !== null && <p><strong>Speed:</strong> {speed} km/h</p>}
                {nextStop && <p><strong>Next Stop:</strong> {nextStop}</p>}
                {eta && <p><strong>ETA:</strong> {eta}</p>}
              </div>
            </Popup>
          </Marker>
          <Recenter position={position} />
        </>
      )}
    </MapContainer>
  );
}
