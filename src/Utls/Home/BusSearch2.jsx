import React, { useState } from "react";
import axios from "axios";
import api from "../../utils/api";

function BusSearch2({ onSearchResults }) {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        date: new Date(formData.date).toISOString()
      };

      console.log("Sending search params:", searchParams);

      const response = await api.get("/searchBuses/buses/search", {
        params: searchParams
      });

      console.log("Search Results:", response.data);
      
      if (Array.isArray(response.data)) {
        onSearchResults(response.data);
        setFormData({
          source: "",
          destination: "",
          date: ""
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      if (err.response) {
        setError(err.response.data.message || "An error occurred. Please try again.");
      } else if (err.request) {
        setError("No response from the server. Please check your network.");
      } else {
        setError("An error occurred while setting up the request.");
      }
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-Darkgreen focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-Darkgreen focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-Darkgreen focus:border-transparent transition-all duration-200"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-Darkgreen to-LightGreen text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Search Buses"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusSearch2;
