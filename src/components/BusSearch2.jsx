import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { notificationService } from '../../services/notificationService';

function BusSchedule({ schedule }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">
            {format(new Date(schedule.departureTime), "h:mm a")}
          </p>
          <p className="text-sm text-neutral-500">Departure</p>
        </div>
        <div className="flex-1 mx-4 border-t-2 border-dashed border-neutral-300"></div>
        <div>
          <p className="text-lg font-semibold">
            {format(new Date(schedule.arrivalTime), "h:mm a")}
          </p>
          <p className="text-sm text-neutral-500">Arrival</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm">
          <span className="font-semibold">Available Seats:</span>{" "}
          <span className={`${schedule.availableSeats > 5 ? 'text-success-600' : 'text-error-600'}`}>
            {schedule.availableSeats}
          </span>
        </div>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          onClick={() => {/* TODO: Implement booking logic */}}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function BusResult({ bus }) {
  return (
    <div className="bg-neutral-50 rounded-xl shadow-lg p-6 mb-6">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-bold text-neutral-800">{bus.name || 'Bus Service'}</h3>
        <p className="text-sm text-neutral-600">Bus ID: {bus._id}</p>
      </div>
      
      {bus.schedules && bus.schedules.length > 0 ? (
        <div className="space-y-4">
          {bus.schedules.map((schedule, index) => (
            <BusSchedule key={index} schedule={schedule} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500 py-4">No schedules available</p>
      )}
    </div>
  );
}

function BusSearch2() {
  const [cities, setCities] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch cities for autocomplete
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/cities");
        setCities(response.data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // Fetch notifications when search results are available
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      const routeId = searchResults[0].routeId;
      const busId = searchResults[0].buses[0]?._id;
      
      const fetchNotifications = async () => {
        try {
          const [trafficDelay, busArrival, weatherAlerts] = await Promise.all([
            notificationService.predictTrafficDelay(routeId, busId),
            notificationService.predictBusArrival(searchResults[0].buses[0].scheduleId),
            notificationService.getWeatherAlerts(routeId)
          ]);

          const processedNotifications = [];
          
          if (trafficDelay?.delay > 0) {
            processedNotifications.push({
              type: 'traffic',
              message: `Expected delay of ${trafficDelay.delay} minutes due to ${trafficDelay.reason}`,
              severity: 'warning'
            });
          }

          if (busArrival?.estimatedTime) {
            processedNotifications.push({
              type: 'arrival',
              message: `Bus estimated to arrive in ${busArrival.estimatedTime} minutes`,
              severity: 'info'
            });
          }

          if (weatherAlerts?.alerts.length > 0) {
            weatherAlerts.alerts.forEach(alert => {
              processedNotifications.push({
                type: 'weather',
                message: alert.message,
                severity: alert.severity
              });
            });
          }

          setNotifications(processedNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [searchResults]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedDate = new Date(date).toISOString();
      const response = await axios.get("http://localhost:8000/api/v1/search-buses", {
        params: {
          origin: from,
          destination: to,
          time: formattedDate,
        },
      });

      setSearchResults(response.data);
      // Clear notifications when new search is performed
      setNotifications([]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "An error occurred while searching for buses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-neutral-800">
          Search for Buses
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                From
              </label>
              <input
                list="fromCities"
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
                placeholder="Select departure city"
              />
              <datalist id="fromCities">
                {cities.map((city) => (
                  <option key={city._id} value={city.name} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                To
              </label>
              <input
                list="toCities"
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
                placeholder="Select destination city"
              />
              <datalist id="toCities">
                {cities.map((city) => (
                  <option key={city._id} value={city.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date of Journey
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search Buses"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-error-50 border-l-4 border-error-500 p-4 mb-8">
          <p className="text-error-700">{error}</p>
        </div>
      )}

      {searchResults && (
        <div className="mt-8">
          {notifications.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaBell className="mr-2 text-Darkgreen" />
                Real-time Updates
              </h3>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 rounded-lg"
                    style={{
                      backgroundColor: getNotificationColor(notification.severity),
                      color: 'white'
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                    <div className="ml-3">
                      <p className="font-medium">{notification.message}</p>
                      <small className="text-sm opacity-80">
                        {new Date().toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <h3 className="text-2xl font-bold mb-6 text-center text-neutral-800">
            {searchResults.length > 0
              ? "Available Buses"
              : "No buses found for this route"}
          </h3>
          
          <div className="space-y-6">
            {searchResults.map((route) =>
              route.buses && route.buses.length > 0 ? (
                route.buses.map((bus) => (
                  <BusResult key={bus._id} bus={bus} />
                ))
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BusSearch2;
