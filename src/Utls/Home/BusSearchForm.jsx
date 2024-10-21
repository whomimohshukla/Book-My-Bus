import React, { useState } from "react";

function BusSearchForm() {
  // State variables to store form data
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your search logic here
    console.log("Search Data:", { from, to, date, time });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Search Buses</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From Location Input */}
        <div>
          {/* <label className="block font-extrabold text-gray-700">From:</label> */}
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* To Location Input */}
        <div>
          {/* <label className="block text-gray-700">To:</label> */}
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To:"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-gray-700">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* Time Schedule Dropdown */}
        <div>
          <label className="block text-gray-700">Time Schedule:</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          >
            <option value="">Select Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Search Buses
          </button>
        </div>
      </form>
    </div>
  );
}

export default BusSearchForm;
