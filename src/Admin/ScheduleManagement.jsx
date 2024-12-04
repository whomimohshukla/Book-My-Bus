import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaBus, FaRoute, FaClock, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("scheduleRoutes/schedule");
      const scheduleData = response.data;
      console.log("Individual schedule examples:", {
        first: scheduleData[0],
        withBus: scheduleData.find(s => s.busId !== null),
        withRoute: scheduleData.find(s => s.routeId !== null)
      });

      if (Array.isArray(scheduleData)) {
        setSchedules(scheduleData);
      } else if (scheduleData && typeof scheduleData === "object") {
        setSchedules(scheduleData.schedules || scheduleData.data || []);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      setError(
        "Failed to fetch schedules: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Fetch schedules error:", err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await api.get("/busRoute/buses");
      const busData = response.data;
      if (busData && busData.data) {
        setBuses(busData.data);
      } else {
        setBuses([]);
      }
    } catch (err) {
      console.error("Failed to fetch buses:", err);
      setBuses([]);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await api.get("/busTravelRoute/Travelroutes");
      const routeData = response.data;
      console.log("Raw route data:", routeData);
      
      if (routeData && routeData.routes) {
        console.log("First route example:", routeData.routes[0]);
        setRoutes(routeData.routes);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      setRoutes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (
        !formData.busId ||
        !formData.routeId ||
        !formData.departureTime ||
        !formData.arrivalTime ||
        !formData.fare
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate times
      const departure = new Date(formData.departureTime);
      const arrival = new Date(formData.arrivalTime);
      if (arrival <= departure) {
        throw new Error("Arrival time must be after departure time");
      }

      // Validate fare
      const fare = parseFloat(formData.fare);
      if (isNaN(fare) || fare <= 0) {
        throw new Error("Fare must be a positive number");
      }

      const processedData = {
        busId: formData.busId,
        routeId: formData.routeId,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        fareDetails: {
          baseFare: fare,
          tax: fare * 0.1, // 10% tax
          serviceFee: 20 // Fixed service fee
        },
        driverDetails: {
          name: "Not Assigned",
          phone: "Not Assigned",
          license: "Not Assigned"
        },
        status: "Active",
        availableSeats: buses.find(bus => bus._id === formData.busId)?.totalSeats || 40
      };

      if (editingId) {
        await api.put(`/scheduleRoutes/schedule/${editingId}`, processedData);
      } else {
        await api.post("/scheduleRoutes/schedule", processedData);
      }

      await fetchSchedules();
      setShowForm(false);
      setFormData({
        busId: "",
        routeId: "",
        departureTime: "",
        arrivalTime: "",
        fare: "",
      });
      setEditingId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(
        `Failed to ${editingId ? "update" : "create"} schedule: ${errorMessage}`
      );
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this schedule?")
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/scheduleRoutes/schedule/${id}`);
      await fetchSchedules();
    } catch (err) {
      setError(
        "Failed to delete schedule: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    if (!schedule || !schedule._id) {
      console.error("Invalid schedule data for editing");
      return;
    }

    const totalFare = (schedule.fareDetails?.baseFare || 0) + 
                     (schedule.fareDetails?.tax || 0) + 
                     (schedule.fareDetails?.serviceFee || 0);

    setFormData({
      busId: schedule.busId?._id || schedule.busId || "",
      routeId: schedule.routeId?._id || schedule.routeId || "",
      departureTime: schedule.departureTime
        ? new Date(schedule.departureTime).toISOString().slice(0, 16)
        : "",
      arrivalTime: schedule.arrivalTime
        ? new Date(schedule.arrivalTime).toISOString().slice(0, 16)
        : "",
      fare: totalFare.toString(),
    });
    setEditingId(schedule._id);
    setShowForm(true);
  };

  const getBusNumber = (busId) => {
    if (!busId) return "No Bus Assigned";
    // If busId is an object with _id property
    const id = typeof busId === 'object' ? busId._id : busId;
    const bus = buses.find(bus => bus._id === id);
    return bus?.busNumber || "No Bus Assigned";
  };

  const getRouteString = (routeId) => {
    if (!routeId) return "No Route Assigned";
    const id = typeof routeId === 'object' ? routeId._id : routeId;
    const route = routes.find(route => route._id === id);
    if (!route) return "No Route Assigned";
    
    const sourceCity = route.source?.city?.name || route.source?.name || 'Unknown';
    const destCity = route.destination?.city?.name || route.destination?.name || 'Unknown';
    return `${sourceCity} to ${destCity}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#349E4D]"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 mt-20 space-y-6"
    >
      {error && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-[#349E4D] to-[#2C8440] p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <FaBus className="text-white" />
          Schedule Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-[#349E4D] px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
        >
          <FaPlus /> {showForm ? "Cancel" : "Add New Schedule"}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg space-y-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {editingId ? "Edit Schedule" : "Add New Schedule"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
                  <FaBus className="inline mr-2 text-[#349E4D]" />
                  Bus
                </label>
                <select
                  value={formData.busId}
                  onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#349E4D] focus:border-transparent transition-all duration-300 font-roboto"
                  required
                >
                  <option value="">Select Bus</option>
                  {Array.isArray(buses) &&
                    buses.map((bus) => (
                      <option key={bus._id} value={bus._id}>
                        {bus.busNumber} - {bus.busName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
                  <FaRoute className="inline mr-2 text-[#349E4D]" />
                  Route
                </label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#349E4D] focus:border-transparent transition-all duration-300 font-roboto"
                  required
                >
                  <option value="">Select Route</option>
                  {Array.isArray(routes) &&
                    routes.map((route) => (
                      <option key={route._id} value={route._id}>
                        {route.source?.city?.name || route.source?.name || 'Unknown'} to{' '}
                        {route.destination?.city?.name || route.destination?.name || 'Unknown'}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
                  <FaClock className="inline mr-2 text-[#349E4D]" />
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#349E4D] focus:border-transparent transition-all duration-300 font-roboto"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
                  <FaClock className="inline mr-2 text-[#349E4D]" />
                  Arrival Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#349E4D] focus:border-transparent transition-all duration-300 font-roboto"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
                  <FaRupeeSign className="inline mr-2 text-[#349E4D]" />
                  Fare
                </label>
                <input
                  type="number"
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#349E4D] focus:border-transparent transition-all duration-300 font-roboto"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#349E4D] text-white px-8 py-3 rounded-lg hover:bg-[#2C8440] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                ) : (
                  <>
                    <FaPlus /> {editingId ? "Update Schedule" : "Add Schedule"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(schedules) && schedules.length > 0 ? (
          schedules.map((schedule, index) => (
            <motion.div
              key={schedule._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="bg-gradient-to-r from-[#349E4D] to-[#2C8440] p-4 group-hover:from-[#2C8440] group-hover:to-[#349E4D] transition-all duration-300">
                <h3 className="text-lg font-semibold text-white">
                  {getBusNumber(schedule.busId)}
                </h3>
                <p className="text-white/80 text-sm">
                  {getRouteString(schedule.routeId)}
                </p>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock className="text-[#349E4D]" />
                  <div>
                    <p className="text-sm font-medium">Departure</p>
                    <p className="text-sm">{new Date(schedule.departureTime).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock className="text-[#349E4D]" />
                  <div>
                    <p className="text-sm font-medium">Arrival</p>
                    <p className="text-sm">{new Date(schedule.arrivalTime).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FaRupeeSign className="text-[#349E4D]" />
                  <div>
                    <p className="text-sm font-medium">Fare</p>
                    <p className="text-sm">₹{(
                      (schedule.fareDetails?.baseFare || 0) +
                      (schedule.fareDetails?.tax || 0) +
                      (schedule.fareDetails?.serviceFee || 0)
                    ).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(schedule)}
                  className="text-[#349E4D] hover:text-[#2C8440] px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 font-semibold"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(schedule._id)}
                  className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 font-semibold"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
            <FaBus className="text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">
              {loading ? "Loading schedules..." : "No schedules found"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScheduleManagement;
