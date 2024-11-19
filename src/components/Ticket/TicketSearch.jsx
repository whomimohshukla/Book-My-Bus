import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";




import {
  FaFilter,
  FaBus,
  FaCalendarAlt,
  FaMapSigns,
  FaArrowRight,
} from "react-icons/fa"; // Import the arrow icon

const TicketSearch = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

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
          status: "Open",
          category: "General",
          vehicle: "AC",
          schedule: "7-9", // Matches the schedule value
          route: "Route A",
          seatChoice: "2 x 2",
          departureTime: "07:00 AM", // Departure time as per the selected schedule
          arrivalTime: "09:00 AM",
          duration: "2 hours",
          startLocation: "Wichita",
          endLocation: "Kansas City",
          price: "$150.00",
          coachName: "Kansas",
          offDays: ["Thursday", "Friday"],
          facilities: ["Water Bottle"],
        },
        {
          id: "002",
          name: "Echo Bass",
          status: "Closed",
          category: "Technical",
          vehicle: "Coach",
          schedule: "9-11", // A different schedule for testing
          route: "Route B",
          seatChoice: "2 x 2",
          departureTime: "04:00 PM",
          arrivalTime: "07:00 PM",
          duration: "3 hours",
          startLocation: "Omaha",
          endLocation: "Lincoln",
          price: "$200.00",
          coachName: "Echo Bass",
          offDays: ["Monday", "Wednesday"],
          facilities: ["Water Bottle", "WiFi"],
        },
      ];

      // Filter the results based on the selected schedule and route
      const filteredResults = simulatedResults.filter((ticket) => {
        return (
          (vehicleTypes.length === 0 ||
            vehicleTypes.includes(ticket.vehicle)) &&
          (selectedSchedule === "" || ticket.schedule === selectedSchedule) &&
          (selectedRoute === "" || ticket.route === selectedRoute)
        );
      });

      setResults(filteredResults);
      setLoading(false);
    }, 1000); // Simulate loading delay
  };

  useEffect(() => {
    handleSearch();
  }, [vehicleTypes, selectedSchedule, selectedRoute]);

  const handleScheduleChange = (e) => {
    setSelectedSchedule(e.target.value);
  };

  const handleRouteChange = (e) => {
    setSelectedRoute(e.target.value);
  };

  const handleVehicleTypeChange = (e) => {
    const { value, checked } = e.target;
    setVehicleTypes((prevState) =>
      checked
        ? [...prevState, value]
        : prevState.filter((vehicle) => vehicle !== value)
    );
  };

  return (
    <div className="container mx-auto mt-5 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filters */}
        <div className="col-span-1 md:col-span-1 p-4 bg-white rounded-lg shadow-md relative">
          <h4 className="text-xl font-semibold mb-10 flex items-center">
            Filters <FaFilter className="inline-block ml-2" />
          </h4>

          <button
            onClick={() => {
              setVehicleTypes([]);
              setSelectedSchedule("");
              setSelectedRoute("");
              setResults([]); // Clear results
            }}
            className="absolute top-4 right-4 text-red-500 text-sm hover:text-red-600"
          >
            Reset All Filters
          </button>

          {/* Vehicle Type Filter */}
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              Vehicle Type <FaBus className="inline-block ml-2" />
            </h5>
            <div className="border-b border-transparent sm:border-gray-300 mb-4"></div>
            {vehicleTypeOptions.map((vehicle) => (
              <div key={vehicle} className="mb-2">
                <input
                  type="checkbox"
                  id={vehicle}
                  value={vehicle}
                  checked={vehicleTypes.includes(vehicle)}
                  onChange={(e) => handleVehicleTypeChange(e)}
                  className="mr-2"
                  aria-label={`Filter by ${vehicle} type`}
                />
                <label htmlFor={vehicle} className="text-sm">
                  {vehicle}
                </label>
              </div>
            ))}
          </div>

          {/* Schedule Filter */}
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              Schedule <FaCalendarAlt className="inline-block ml-2" />
            </h5>
            <div className="border-b border-transparent sm:border-gray-300 mb-4"></div>
            {scheduleOptions.map((schedule) => (
              <div key={schedule.value} className="mb-2">
                <input
                  type="radio"
                  id={schedule.value}
                  name="schedule"
                  value={schedule.value}
                  checked={selectedSchedule === schedule.value}
                  onChange={handleScheduleChange}
                  className="mr-2"
                  aria-label={`Select ${schedule.label} schedule`}
                />
                <label htmlFor={schedule.value} className="text-sm">
                  {schedule.label}
                </label>
              </div>
            ))}
          </div>

          {/* Route Filter */}
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              Route <FaMapSigns className="inline-block ml-2" />
            </h5>
            <div className="border-b border-transparent sm:border-gray-300 mb-4"></div>
            {routeOptions.map((route) => (
              <div key={route} className="mb-2">
                <input
                  type="radio"
                  id={route}
                  name="route"
                  value={route}
                  checked={selectedRoute === route}
                  onChange={handleRouteChange}
                  className="mr-2"
                  aria-label={`Select ${route} route`}
                />
                <label htmlFor={route} className="text-sm">
                  {route}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="col-span-3 p-4 bg-white rounded-lg shadow-md w-full">
          <h1 className="text-2xl font-semibold mb-4">Ticket Search</h1>
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <div className="results">
              <h3 className="text-xl font-medium mb-3">Results:</h3>
              {results.length > 0 ? (
                <div className="grid gap-6">
                  {results.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-5 bg-gray-50 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-xl">{ticket.name}</div>
                        <div className="text-sm">{ticket.status}</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <strong>Vehicle:</strong> {ticket.vehicle}
                        </div>
                        <div>
                          <strong>Schedule:</strong> {ticket.schedule}
                        </div>
                        <div>
                          <strong>Route:</strong> {ticket.route}
                        </div>
                        <div>
                          <strong>Price:</strong> {ticket.price}
                        </div>

                        <Link to="/seatSelection">
                          <button className="bg-Darkgreen text-white2 hover:bg-LightGreen text-sm py-2 px-4 rounded-full">
                            Select Seats
                          </button>
                        </Link>

                        {/* Book Now Button */}
                        <div className="mt-3">
                          <button className="text-blue hover:underline">
                            Book Now{" "}
                            <FaArrowRight className="inline-block ml-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No tickets found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSearch;
