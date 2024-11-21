import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaBus,
  FaCalendarAlt,
  FaMapSigns,
  FaArrowRight,
  FaClock,
  FaRupeeSign,
  FaRegClock,
  FaMapMarkerAlt,
  FaWifi,
  FaSnowflake,
  FaChargingStation,
  FaToilet,
  FaExchangeAlt,
  FaSearch,
} from "react-icons/fa";
import { BiDrink } from "react-icons/bi";

const TicketSearch = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  
  // New states for search
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");
  const [popularCities] = useState([
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego"
  ]);

  // Function to swap locations
  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const vehicleTypeOptions = ["Classic", "Coach", "AC"];
  const scheduleOptions = [
    { label: "7:00 AM - 9:00 AM", value: "7-9" },
    { label: "9:00 AM - 11:00 AM", value: "9-11" },
    { label: "11:00 AM - 1:00 PM", value: "11-1" },
    { label: "1:00 PM - 3:00 PM", value: "1-3" },
    { label: "3:00 PM - 5:00 PM", value: "3-5" },
    { label: "5:00 PM - 7:00 PM", value: "5-7" },
    { label: "7:00 PM - 9:00 PM", value: "7-9-evening" },
  ];
  const routeOptions = ["Route A", "Route B", "Route C"];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const simulatedResults = [
        {
          id: "001",
          name: "Echo Bass",
          status: "Available",
          category: "General",
          vehicle: "AC",
          schedule: "7-9",
          route: "Route A",
          seatChoice: "2 x 2",
          departureTime: "07:00 AM",
          arrivalTime: "09:00 AM",
          duration: "2 hours",
          startLocation: "Wichita",
          endLocation: "Kansas City",
          price: 150,
          seatsAvailable: 23,
          rating: 4.5,
          coachName: "Kansas Express",
          offDays: ["Thursday", "Friday"],
          facilities: ["AC", "WiFi", "Charging Point", "Water", "Toilet"],
        },
        {
          id: "002",
          name: "Echo Bass Premium",
          status: "Almost Full",
          category: "Premium",
          vehicle: "Coach",
          schedule: "9-11",
          route: "Route B",
          seatChoice: "2 x 2",
          departureTime: "04:00 PM",
          arrivalTime: "07:00 PM",
          duration: "3 hours",
          startLocation: "Omaha",
          endLocation: "Lincoln",
          price: 200,
          seatsAvailable: 5,
          rating: 4.8,
          coachName: "Echo Bass Gold",
          offDays: ["Monday", "Wednesday"],
          facilities: ["AC", "WiFi", "Charging Point", "Water", "Toilet"],
        },
      ];

      const filteredResults = simulatedResults.filter((ticket) => {
        return (
          (vehicleTypes.length === 0 || vehicleTypes.includes(ticket.vehicle)) &&
          (selectedSchedule === "" || ticket.schedule === selectedSchedule) &&
          (selectedRoute === "" || ticket.route === selectedRoute)
        );
      });

      // Sort results
      const sortedResults = [...filteredResults].sort((a, b) => {
        switch (sortBy) {
          case "price":
            return a.price - b.price;
          case "departure":
            return a.departureTime.localeCompare(b.departureTime);
          case "duration":
            return a.duration.localeCompare(b.duration);
          case "rating":
            return b.rating - a.rating;
          default:
            return 0;
        }
      });

      setResults(sortedResults);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleSearch();
  }, [vehicleTypes, selectedSchedule, selectedRoute, sortBy]);

  const getFacilityIcon = (facility) => {
    switch (facility.toLowerCase()) {
      case "wifi":
        return <FaWifi className="text-gray-600" title="WiFi" />;
      case "ac":
        return <FaSnowflake className="text-gray-600" title="AC" />;
      case "charging point":
        return <FaChargingStation className="text-gray-600" title="Charging Point" />;
      case "water":
        return <BiDrink className="text-gray-600" title="Water" />;
      case "toilet":
        return <FaToilet className="text-gray-600" title="Toilet" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto mt-5 p-4">
      {/* Search Section */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen rounded-lg shadow-lg p-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white2 mb-6">Book Bus Tickets</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            {/* From Location */}
            <div className="md:col-span-2">
              <label className="block text-white2 text-sm mb-2">From</label>
              <div className="relative">
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-3 rounded-lg bg-white2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-LightGreen"
                />
                {fromLocation && (
                  <div className="absolute z-10 w-full mt-1 bg-white2 rounded-lg shadow-lg">
                    {popularCities
                      .filter(city => 
                        city.toLowerCase().includes(fromLocation.toLowerCase())
                      )
                      .map((city, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setFromLocation(city)}
                        >
                          {city}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={swapLocations}
                className="p-3 rounded-full bg-white2 text-Darkgreen hover:bg-gray-100 transition-colors duration-200"
                aria-label="Swap locations"
              >
                <FaExchangeAlt className="transform -rotate-90" />
              </button>
            </div>

            {/* To Location */}
            <div className="md:col-span-2">
              <label className="block text-white2 text-sm mb-2">To</label>
              <div className="relative">
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-3 rounded-lg bg-white2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-LightGreen"
                />
                {toLocation && (
                  <div className="absolute z-10 w-full mt-1 bg-white2 rounded-lg shadow-lg">
                    {popularCities
                      .filter(city => 
                        city.toLowerCase().includes(toLocation.toLowerCase())
                      )
                      .map((city, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setToLocation(city)}
                        >
                          {city}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-1">
              <label className="block text-white2 text-sm mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg bg-white2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-LightGreen"
              />
            </div>

            {/* Search Button */}
            <div className="md:col-span-1">
              <button
                onClick={handleSearch}
                className="w-full bg-Darkgreen hover:bg-LightGreen text-white2 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="mt-6">
            <h3 className="text-white2 text-sm mb-2">Popular Routes:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "NYC → Boston",
                "LA → San Francisco",
                "Chicago → Detroit",
                "Houston → Dallas"
              ].map((route, index) => (
                <button
                  key={index}
                  className="bg-white2 bg-opacity-20 text-white2 text-sm px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors duration-200"
                >
                  {route}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="col-span-1 md:col-span-1">
          <div className="bg-white2 rounded-lg shadow-md p-4 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold flex items-center text-Darkgreen">
                <FaFilter className="mr-2" /> Filters
              </h4>
              <button
                onClick={() => {
                  setVehicleTypes([]);
                  setSelectedSchedule("");
                  setSelectedRoute("");
                }}
                className="text-red-500 text-sm hover:text-red-600 font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Vehicle Type Filter */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 flex items-center text-gray-700">
                <FaBus className="mr-2" /> Vehicle Type
              </h5>
              <div className="space-y-2">
                {vehicleTypeOptions.map((vehicle) => (
                  <label
                    key={vehicle}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      value={vehicle}
                      checked={vehicleTypes.includes(vehicle)}
                      onChange={(e) => handleVehicleTypeChange(e)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{vehicle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedule Filter */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 flex items-center text-gray-700">
                <FaCalendarAlt className="mr-2" /> Departure Time
              </h5>
              <div className="space-y-2">
                {scheduleOptions.map((schedule) => (
                  <label
                    key={schedule.value}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="schedule"
                      value={schedule.value}
                      checked={selectedSchedule === schedule.value}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{schedule.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Route Filter */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 flex items-center text-gray-700">
                <FaMapSigns className="mr-2" /> Route
              </h5>
              <div className="space-y-2">
                {routeOptions.map((route) => (
                  <label
                    key={route}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="route"
                      value={route}
                      checked={selectedRoute === route}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{route}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-span-3">
          {/* Sort Options */}
          <div className="bg-white2 rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-Darkgreen">Available Buses</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-LightGreen"
                >
                  <option value="price">Price</option>
                  <option value="departure">Departure Time</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white2 rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Darkgreen"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-Darkgreen">
                            {ticket.coachName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {ticket.vehicle} • {ticket.seatChoice} Seating
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm bg-green-100 text-Darkgreen px-3 py-1 rounded-full">
                            {ticket.status}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {ticket.seatsAvailable} seats available
                          </div>
                        </div>
                      </div>

                      {/* Journey Details */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-2xl font-bold text-Darkgreen">
                            {ticket.departureTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            <FaMapMarkerAlt className="inline mr-1" />
                            {ticket.startLocation}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">
                            <FaRegClock className="inline mr-1" />
                            {ticket.duration}
                          </div>
                          <div className="border-t border-b border-gray-300 my-2"></div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-Darkgreen">
                            {ticket.arrivalTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            <FaMapMarkerAlt className="inline mr-1" />
                            {ticket.endLocation}
                          </div>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex items-center space-x-4 mb-4">
                        {ticket.facilities.map((facility, index) => (
                          <div
                            key={index}
                            className="flex items-center text-gray-600"
                            title={facility}
                          >
                            {getFacilityIcon(facility)}
                          </div>
                        ))}
                      </div>

                      {/* Price and Actions */}
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <div className="text-2xl font-bold text-Darkgreen flex items-center">
                            <FaRupeeSign className="text-xl" />
                            {ticket.price}
                          </div>
                          <div className="text-sm text-gray-600">Per seat</div>
                        </div>
                        <div className="space-x-3">
                          <Link
                            to="/seatSelection"
                            className="inline-block bg-Darkgreen text-white2 px-6 py-2 rounded-lg hover:bg-LightGreen transition-colors duration-200"
                          >
                            Select Seats
                          </Link>
                          <button className="text-Darkgreen hover:text-LightGreen font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white2 rounded-lg shadow-md p-8 text-center">
                  <div className="text-gray-600 text-lg">No buses found</div>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSearch;
