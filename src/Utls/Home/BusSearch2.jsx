import React, { useState } from "react";
import axios from "axios";
import CTAButton from "../Home/Button";

function BusResult({ bus }) {
  return (
    <li className="p-4 border-b">
      <p>{`Route: ${bus.name || 'No name available'}`}</p>
      {bus.schedules && bus.schedules.length > 0 ? (
        bus.schedules.map((schedule, index) => (
          <div key={index} className="mt-2">
            <p>{`Departure: ${new Date(schedule.departureTime).toLocaleString()}`}</p>
            <p>{`Arrival: ${new Date(schedule.arrivalTime).toLocaleString()}`}</p>
            <p>{`Available Seats: ${schedule.availableSeats || 'N/A'}`}</p>
          </div>
        ))
      ) : (
        <p>No available schedules</p>
      )}
    </li>
  );
}

function BusSearch2() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedDate = new Date(date).toISOString();

    try {
      const response = await axios.get("http://localhost:8000/api/v1/search-buses", {
        params: {
          origin: from,
          destination: to,
          time: formattedDate,
        },
      });

      console.log("Search Results:", response.data); // Debugging output
      setSearchResults(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "An error occurred. Please try again.");
      } else if (err.request) {
        setError("No response from the server. Please check your network.");
      } else {
        setError("An error occurred while setting up the request.");
      }
    } finally {
      setLoading(false);
      setFrom("");
      setTo("");
      setDate("");
    }
  };

  return (
    <div className="p-6 w-full max-w-lg mx-auto bg-white rounded-lg shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Search for Buses</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-6">
          <div className="w-1/2">
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From"
              className="w-full p-2 border border-Darkgreen focus:border-Darkgreen focus:outline-Darkgreen rounded placeholder-black font-semibold"
              required
            />
          </div>
          <div className="w-1/2">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To"
              className="w-full p-2 border border-Darkgreen focus:border-Darkgreen focus:outline-Darkgreen rounded placeholder-black font-semibold"
              required
            />
          </div>
        </div>

        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-5 p-2 border border-Darkgreen focus:border-Darkgreen focus:outline-Darkgreen rounded placeholder-black font-semibold"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 bg-Darkgreen hover:shadow-none hover:scale-95 transition-all duration-200 text-white2 font-semibold rounded-lg hover:bg-Darkgreen shadow-md"
          >
            Search Buses
          </button>
        </div>
      </form>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && (
        <p className="text-center mt-4 text-red-500 font-semibold">{error}</p>
      )}

      {searchResults && searchResults.length === 0 && (
        <p className="text-center mt-4 text-gray-500 font-semibold">
          No buses found for the selected route.
        </p>
      )}

      {searchResults &&
        Array.isArray(searchResults) &&
        searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-center">Search Results</h3>
            <ul className="mt-4">
              {searchResults.map((route) => {
                return route.buses && route.buses.length > 0 ? (
                  route.buses.map((bus) => <BusResult key={bus._id} bus={bus} />)
                ) : (
                  <li key={route._id}>No buses available for this route</li>
                );
              })}
            </ul>
          </div>
        )}
    </div>
  );
}

export default BusSearch2;
