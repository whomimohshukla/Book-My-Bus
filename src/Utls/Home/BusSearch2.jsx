import React, { useState } from "react";
import CTAButton from "../Home/Button";

function BusSearch2() {
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
    <div className="= p-6 w-full  max-w-lg mx-auto bg-white rounded-lg shadow-2xl ">
      <h2 className="text-2xl font-semibold mb-6 text-center">Search for Buses</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From and To Fields */}
        <div className="flex gap-6">
          <div className="w-1/2">
            {/* <label className="block text-gray-700 mb-1">From:</label> */}
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
            {/* <label className="block text-gray-700 mb-1">To:</label> */}
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

        {/* Date Picker */}
        <div>
          {/* <label className="block text-gray-700 mb-1">Date:</label> */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-5 p-2 border border-Darkgreen focus:border-Darkgreen focus:outline-Darkgreen rounded placeholder-black font-semibold"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <div className="w-80">
            <CTAButton active="true" linkto="/getTicket">
              SEARCH BUSES
            </CTAButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BusSearch2;
