import React, { useState } from 'react';
import { FaFilter, FaBus, FaCalendarAlt, FaMapSigns, FaArrowRight, FaClock,
  FaRupeeSign, FaRegClock, FaMapMarkerAlt, FaWifi, FaSnowflake,
  FaChargingStation, FaToilet, FaExchangeAlt, FaSearch, FaStar,
  FaChevronDown, FaChevronUp, FaUser, FaPhone, FaCar } from 'react-icons/fa';

const SearchResults = ({ results }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sortResults = (items) => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.fareDetails?.baseFare || 0) - (b.fareDetails?.baseFare || 0);
        case 'duration':
          return (new Date(a.arrivalTime) - new Date(a.departureTime)) -
                 (new Date(b.arrivalTime) - new Date(b.departureTime));
        case 'departure':
          return new Date(a.departureTime) - new Date(b.departureTime);
        case 'seats':
          return b.availableSeats - a.availableSeats;
        default:
          return 0;
      }
    });
  };

  const filterResults = (items) => {
    if (filterBy === 'all') return items;
    return items.filter(bus => {
      switch (filterBy) {
        case 'ac':
          return bus.busId?.type === 'AC';
        case 'nonAc':
          return bus.busId?.type !== 'AC';
        case 'sleeper':
          return bus.busId?.type?.toLowerCase().includes('sleeper');
        case 'seater':
          return bus.busId?.type?.toLowerCase().includes('seater');
        default:
          return true;
      }
    });
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const calculateDuration = (departure, arrival) => {
    try {
      const start = new Date(departure);
      const end = new Date(arrival);
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 'Duration N/A';
    }
  };

  const calculateTotalFare = (fareDetails) => {
    if (!fareDetails) return 'N/A';
    const { baseFare = 0, tax = 0, serviceFee = 0 } = fareDetails;
    return baseFare + tax + serviceFee;
  };

  const processedResults = sortResults(filterResults(results));

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <FaBus className="mx-auto text-6xl text-Darkgreen mb-4" />
        <h3 className="text-xl font-semibold text-Darkgreen mb-2">
          No buses found for this route
        </h3>
        <p className="text-gray-600">
          Try different dates or destinations
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white2 border border-gray-300 rounded-lg py-2 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-Darkgreen"
          >
            <option value="price">Sort by Price</option>
            <option value="duration">Sort by Duration</option>
            <option value="departure">Sort by Departure</option>
            <option value="seats">Sort by Available Seats</option>
          </select>
          <FaFilter className="absolute left-3 top-3 text-Darkgreen" />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="appearance-none bg-white2 border border-gray-300 rounded-lg py-2 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-Darkgreen"
          >
            <option value="all">All Buses</option>
            <option value="ac">AC</option>
            <option value="nonAc">Non-AC</option>
            <option value="sleeper">Sleeper</option>
            <option value="seater">Seater</option>
          </select>
          <FaFilter className="absolute left-3 top-3 text-Darkgreen" />
        </div>

        <span className="text-sm text-gray-600">
          {processedResults.length} buses found
        </span>
      </div>

      <div className="space-y-4">
        {processedResults.map((bus, index) => (
          <div
            key={bus._id || index}
            className="bg-white2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Bus Info */}
                <div className="md:col-span-3">
                  <h3 className="text-lg font-semibold text-Darkgreen">
                    {bus.busId?.busName || 'Bus Name N/A'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {bus.busId?.type || 'Type N/A'} • {bus.busId?.busNumber || 'Number N/A'}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-Darkgreen mr-1" />
                    <span>{bus.routeId?.source?.name} → {bus.routeId?.destination?.name}</span>
                  </div>
                </div>

                {/* Time Info */}
                <div className="md:col-span-3">
                  <div className="flex items-center mb-1">
                    <FaClock className="text-Darkgreen mr-2" />
                    <span className="text-sm">
                      {formatTime(bus.departureTime)} - {formatTime(bus.arrivalTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Duration: {calculateDuration(bus.departureTime, bus.arrivalTime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Distance: {bus.routeId?.distance || 'N/A'} km
                  </p>
                </div>

                {/* Seats Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <FaUser className="text-Darkgreen mr-2" />
                    <span className="text-sm">
                      {bus.availableSeats}/{bus.busId?.totalSeats} seats
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bus.busId?.amenities?.map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        title={amenity.description}
                      >
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Info */}
                <div className="md:col-span-2">
                  <div className="text-xl font-bold text-Darkgreen">
                    ₹{calculateTotalFare(bus.fareDetails)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Base Fare: ₹{bus.fareDetails?.baseFare}
                  </div>
                  <div className="text-xs text-gray-600">
                    +Tax: ₹{bus.fareDetails?.tax}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-2">
                  <button className="w-full bg-Darkgreen hover:bg-LightGreen text-white2 font-semibold py-2 px-4 rounded-lg transition-colors mb-2">
                    Book Now
                  </button>
                  <button
                    onClick={() => handleExpandClick(index)}
                    className="w-full flex items-center justify-center text-Darkgreen hover:text-LightGreen transition-colors"
                  >
                    {expandedId === index ? (
                      <FaChevronUp className="text-xl" />
                    ) : (
                      <FaChevronDown className="text-xl" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === index && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Route Details */}
                    <div>
                      <h4 className="font-semibold text-Darkgreen mb-3">Route Details</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-gray-600">Source:</span>
                          <span className="col-span-2">
                            {bus.routeId?.source?.name}, {bus.routeId?.source?.state}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-gray-600">Destination:</span>
                          <span className="col-span-2">
                            {bus.routeId?.destination?.name}, {bus.routeId?.destination?.state}
                          </span>
                        </div>
                        {bus.routeId?.viaStops?.map((stop, i) => (
                          <div key={i} className="grid grid-cols-3 text-sm">
                            <span className="text-gray-600">Via Stop {i + 1}:</span>
                            <span className="col-span-2">
                              {stop.name} ({stop.arrivalTime} - {stop.departureTime})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Driver Details */}
                    <div>
                      <h4 className="font-semibold text-Darkgreen mb-3">Driver Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <FaUser className="text-Darkgreen mr-2" />
                          <span>{bus.driverDetails?.name}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FaPhone className="text-Darkgreen mr-2" />
                          <span>{bus.driverDetails?.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FaCar className="text-Darkgreen mr-2" />
                          <span>License: {bus.driverDetails?.license}</span>
                        </div>
                      </div>
                    </div>

                    {/* Seat Layout */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-Darkgreen mb-3">Seat Layout</h4>
                      <div className="flex flex-wrap gap-2">
                        {bus.busId?.seatLayout?.seats?.map((seat, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              seat.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {seat.seatNumber} - {seat.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
