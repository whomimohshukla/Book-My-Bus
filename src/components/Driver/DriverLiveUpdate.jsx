import { useState, useRef } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { FaBus, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

/**
 * Simple dashboard for drivers/operators to send live GPS updates.
 * Steps:
 * 1. Enter BusId or Tracking Doc _id.
 * 2. If only BusId is provided and no tracking doc exists, a stub will be auto-created by backend.
 * 3. Enter latitude & longitude and click "Send Update" – PATCHes tracking doc.
 */
export default function DriverLiveUpdate() {
  const [busNumber, setBusNumber] = useState(""); // e.g. MH12AB1234
  const [busId, setBusId] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [locationStr, setLocationStr] = useState(""); // address or "City, State"
  const [speed, setSpeed] = useState("");
  const [nextStop, setNextStop] = useState("");
  const [eta, setEta] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoUpdating, setAutoUpdating] = useState(false);
  const autoIntervalRef = useRef(null);

  const getBrowserLocation = (callback) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude.toString());
        setLon(longitude.toString());
        toast.success("Coordinates captured from device");
        if (callback) callback(latitude, longitude);
      },
      () => toast.error("Unable to retrieve location"),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  };

  const sendUpdate = async (latOverride = null, lonOverride = null) => {
    if (!busId && !busNumber) return toast.error("Enter Bus Number or BusId");
    const haveCoords =
      latOverride !== null && lonOverride !== null
        ? true
        : lat !== "" && lon !== "";
    if (!locationStr && !haveCoords) {
      return toast.error("Enter location string or lat/lon");
    }

    try {
      setLoading(true);
      // Resolve busId if only busNumber provided
      let resolvedBusId = busId;
      if (!resolvedBusId && busNumber) {
        try {
          const { data } = await axiosInstance.get(`/api/busRoute/by-number/${busNumber}`);
          resolvedBusId = data?._id || data?.busId || "";
          if (!resolvedBusId) throw new Error("Bus not found");
          setBusId(resolvedBusId);
        } catch (e) {
          throw new Error("Could not resolve bus number to ID");
        }
      }

      // Geocode if lat/lon missing
      let latitude = latOverride ?? lat;
      let longitude = lonOverride ?? lon;
      if ((!latitude || !longitude) && locationStr) {
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationStr)}`);
        const geo = await resp.json();
        if (geo && geo.length) {
          latitude = geo[0].lat;
          longitude = geo[0].lon;
          setLat(latitude);
          setLon(longitude);
        } else {
          throw new Error("Location not found");
        }
      }

      // First fetch (or auto-create) tracking document by busId to know its _id
      const { data: trackDoc } = await axiosInstance.get(
        `/api/live-tracking/bus/${resolvedBusId}`
      );
      const id = trackDoc._id;
      setTrackingId(id);

      // Debug
      console.log("Attempting to send coords", { latitude, longitude });
      // Validate numeric coords
      const lonNum = Number(longitude);
      const latNum = Number(latitude);
      if (Number.isNaN(lonNum) || Number.isNaN(latNum)) {
        throw new Error("Invalid latitude/longitude values");
      }
      // Now patch with new coordinates
      await axiosInstance.patch(`/api/live-tracking/${id}`, {
        currentLocation: { type: "Point", coordinates: [lonNum, latNum] },
        speed: speed ? Number(speed) : undefined,
        nextStop: nextStop || undefined,
        eta: eta || undefined,
      });
      toast.success("Location sent!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
          <FaBus /> Driver Live Update
        </h1>
        <label className="block text-sm font-medium text-gray-700">
          Bus Number (ex: MH12AB1234)
          <input
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
          />
        </label>
        <label className="block text-xs text-gray-500">Or enter Bus ID directly</label>
        <input
          type="text"
          placeholder="BusId (24-char ObjectId)"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="mt-1 mb-4 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
        />
        <label className="block text-sm font-medium text-gray-700">
          Location (address / city / stop)
          <input
            type="text"
            value={locationStr}
            onChange={(e) => setLocationStr(e.target.value)}
            placeholder="e.g. MG Road, Pune"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Latitude
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Speed (km/h)
          <input
            type="number"
            step="any"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Next Stop
          <input
            type="text"
            value={nextStop}
            onChange={(e) => setNextStop(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          ETA (e.g. 14:45)
          <input
            type="text"
            placeholder="HH:MM"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Longitude
          <input
            type="number"
            step="any"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200"
          />
        </label>

        {trackingId && (
          <p className="text-xs text-gray-500 break-all">
            Tracking Doc: <span className="font-mono">{trackingId}</span>
          </p>
        )}

        <button
          onClick={() => sendUpdate()}
          disabled={loading}
          className="w-full py-2 bg-Darkgreen text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FaMapMarkerAlt /> {loading ? "Sending..." : "Send Update"}
        </button>

        <button
          type="button"
          onClick={() => getBrowserLocation()}
          className="w-full py-2 border border-Darkgreen text-Darkgreen rounded-md hover:bg-green-50 flex items-center justify-center gap-2"
        >
          📍 Use My Location
        </button>

        <button
          type="button"
          onClick={() => {
            if (autoUpdating) {
              clearInterval(autoIntervalRef.current);
              setAutoUpdating(false);
              toast.info("Auto update stopped");
            } else {
              getBrowserLocation((la, lo) => sendUpdate(la, lo));
              autoIntervalRef.current = setInterval(() => {
                getBrowserLocation((la, lo) => sendUpdate(la, lo));
              }, 10000);
              setAutoUpdating(true);
              toast.success("Auto update started (10s interval)");
            }
          }}
          className={`w-full py-2 mt-2 rounded-md flex items-center justify-center gap-2 ${autoUpdating ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
        >
          {autoUpdating ? '⏹ Stop Auto Update' : '▶️ Start Auto Update'}
        </button>
      </div>
    </div>
  );
}
