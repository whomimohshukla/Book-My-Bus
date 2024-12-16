import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { FaExchangeAlt, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaRegClock } from "react-icons/fa";

const SearchForm = ({ onSearch, disabled }) => {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
  });

  const [formError, setFormError] = useState("");
  const [popularCities] = useState([
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Goa"
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError("");
  };

  const handleExchange = () => {
    setFormData(prev => ({
      ...prev,
      source: prev.destination,
      destination: prev.source
    }));
  };

  const validateForm = () => {
    if (!formData.source.trim()) {
      setFormError("Source city is required");
      return false;
    }
    if (!formData.destination.trim()) {
      setFormError("Destination city is required");
      return false;
    }
    if (!formData.date) {
      setFormError("Date is required");
      return false;
    }
    if (formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      setFormError("Source and destination cannot be the same");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...formData,
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        date: formData.date,
        time: formData.time || undefined
      };
      onSearch(formattedData);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gradient-to-r from-Darkgreen to-LightGreen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Book Your Bus Tickets
          </h1>
          <p className="text-lg text-white/90">
            Travel safely and comfortably across India
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-end">
              {formError && (
                <div className="col-span-full">
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                </div>
              )}

              {disabled && (
                <div className="col-span-full">
                  <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg">
                    Waiting for server connection... Please wait.
                  </div>
                </div>
              )}

              {/* Source City */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-Darkgreen pl-10"
                    disabled={disabled}
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-Darkgreen" />
                  {formData.source && (
                    <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {popularCities
                        .filter(city => 
                          city.toLowerCase().includes(formData.source.toLowerCase())
                        )
                        .map((city, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setFormData(prev => ({ ...prev, source: city }))}
                          >
                            {city}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Exchange Button */}
              <div className="hidden lg:flex justify-center">
                <button
                  type="button"
                  onClick={handleExchange}
                  disabled={disabled}
                  className="p-3 rounded-full bg-gray-100 text-Darkgreen hover:bg-gray-200 transition-colors"
                >
                  <FaExchangeAlt className="transform -rotate-90" />
                </button>
              </div>

              {/* Destination City */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-Darkgreen pl-10"
                    disabled={disabled}
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-Darkgreen" />
                  {formData.destination && (
                    <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {popularCities
                        .filter(city => 
                          city.toLowerCase().includes(formData.destination.toLowerCase())
                        )
                        .map((city, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setFormData(prev => ({ ...prev, destination: city }))}
                          >
                            {city}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="sm:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-Darkgreen pl-10"
                    disabled={disabled}
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-Darkgreen" />
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-1">
                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full bg-Darkgreen hover:bg-LightGreen text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaSearch className="mr-2" />
                  Search
                </button>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="mt-6">
              <h3 className="text-gray-700 text-sm font-medium mb-2">Popular Routes:</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Mumbai → Pune",
                  "Delhi → Agra",
                  "Bangalore → Mysore",
                  "Chennai → Pondicherry",
                  "Hyderabad → Vijayawada"
                ].map((route, index) => (
                  <button
                    key={index}
                    type="button"
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {route}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
