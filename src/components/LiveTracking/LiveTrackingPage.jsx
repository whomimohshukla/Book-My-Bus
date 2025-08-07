import { useParams } from "react-router-dom";
import BusMap from "./BusMap";
import { useSocket } from "../../contexts/SocketProvider.jsx";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";

export default function LiveTrackingPage() {
  const { busId, bookingId } = useParams();
  const socket = useSocket();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [bookingCoords, setBookingCoords] = useState({ start: null, end: null });
  const [speed, setSpeed] = useState(null);
  const [eta, setEta] = useState(null);
  const [nextStop, setNextStop] = useState(null);

  // initial fetch of current location / ETA
  useEffect(() => {
    async function fetchInitial() {
      try {
        const { data } = await axiosInstance.get(
          `/api/live-tracking/bus/${busId}`
        );
        console.log("Initial tracking data", data);
        setTrackingInfo(data);
      } catch (err) {
        console.error("Failed to fetch live tracking info", err);
      }
    }
    fetchInitial();
  }, [busId]);

  // After socket connects, join bus room
  useEffect(() => {
    if (!socket) return;
    socket.emit("JOIN_ROOM", `bus-${busId}`);
  }, [socket, busId]);

  // listen for location updates, arrival notices, etc. specifically for this bus
  useEffect(() => {
    if (!socket) return;
    const locHandler = ({ busId: id, coordinates }) => {
      if (id === busId && trackingInfo) {
        setTrackingInfo((prev) => ({ ...prev, currentLocation: { coordinates } }));
      }
    };
    socket.on("LOCATION_UPDATE", ({ busId: id, coordinates, speed: spd }) => {
      console.log("LOCATION_UPDATE received", { id, coordinates, spd });
      if (id === busId) {
        setTrackingInfo((prev) => prev ? { ...prev, currentLocation: { coordinates } } : prev);
        if (spd !== undefined && spd !== null) setSpeed(spd);
      }
    });
    const arrivalHandler = ({ busId: id, stopName, eta: e }) => {
      if (id === busId) {
        toast.info(`Arriving soon at ${stopName} – ETA ${e}`);
        setNextStop(stopName);
        setEta(e);
      }
    };
    const destHandler = ({ busId: id, time }) => {
      if (id === busId) {
        toast.success("Reached destination at " + new Date(time).toLocaleTimeString());
      }
    };
    socket.on("ARRIVAL_NOTICE", arrivalHandler);
    socket.on("DESTINATION_NOTICE", destHandler);
    return () => {
      socket.off("LOCATION_UPDATE");
      socket.off("ARRIVAL_NOTICE", arrivalHandler);
      socket.off("DESTINATION_NOTICE", destHandler);
    };
  }, [socket, busId, trackingInfo]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Live Tracking</h1>
      <BusMap 
        initialCoords={trackingInfo?.currentLocation?.coordinates}
        startCoords={bookingCoords.start}
        endCoords={bookingCoords.end}
        speed={speed}
        eta={eta}
        nextStop={nextStop}
        status={trackingInfo?.status}
      />
      {trackingInfo && (
        <div className="mt-4 bg-white shadow rounded p-4">
          <p>
            Status: <strong>{trackingInfo.status}</strong>
          </p>
          {trackingInfo.estimatedArrivalTime && (
            <p>
              ETA:{" "}
              {new Date(trackingInfo.estimatedArrivalTime).toLocaleString()}
            </p>
          )}
        {speed !== null && (
            <p>
              Speed: <strong>{speed} km/h</strong>
            </p>
          )}
          {nextStop && (
            <p>
              Next Stop: <strong>{nextStop}</strong>
            </p>
          )}
          {eta && (
            <p>
              ETA: <strong>{eta}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
