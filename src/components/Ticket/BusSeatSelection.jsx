import React, { useState } from "react";
import { FaChair } from "react-icons/fa"; // Using React Icons for seats

const BusSeatSelection = () => {
  // Seat data structure: row and column-based
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  const cols = [1, 2, "", 3, 4]; // Add aisle spacing with an empty string

  // Seat statuses
  const [seats, setSeats] = useState(
    rows.reduce((acc, row) => {
      cols.forEach((col) => {
        if (col !== "") {
          acc[`${row}${col}`] = "available"; // Possible statuses: "available", "selected", "bookedMale", "bookedFemale", "bookedOther"
        }
      });
      return acc;
    }, {})
  );

  // Handle seat click
  const handleSeatClick = (seat) => {
    setSeats((prevSeats) => {
      const currentStatus = prevSeats[seat];
      if (currentStatus === "available") return { ...prevSeats, [seat]: "selected" };
      if (currentStatus === "selected") return { ...prevSeats, [seat]: "available" };
      return prevSeats; // No action for already booked seats
    });
  };

  // Render seat with dynamic classes
  const renderSeat = (seat, status) => {
    let seatClass = "";
    if (status === "available") seatClass = "bg-gray-200 hover:bg-blue-100";
    if (status === "selected") seatClass = "bg-blue-500 text-white";
    if (status === "bookedMale") seatClass = "bg-green-400 text-white";
    if (status === "bookedFemale") seatClass = "bg-pink-400 text-white";
    if (status === "bookedOther") seatClass = "bg-yellow-400 text-white";

    return (
      <div
        key={seat}
        className={`flex items-center justify-center w-14 h-14 m-1 rounded-md shadow-md text-center cursor-pointer ${seatClass}`}
        onClick={() => (status === "available" || status === "selected" ? handleSeatClick(seat) : null)}
        title={seat}
      >
        <FaChair className="text-lg" />
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Select Your Seats</h2>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mb-8">
        <span className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <span>Available</span>
        </span>
        <span className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 text-white rounded"></div>
          <span>Selected</span>
        </span>
        <span className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-400 rounded"></div>
          <span>Booked (Male)</span>
        </span>
        <span className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-pink-400 rounded"></div>
          <span>Booked (Female)</span>
        </span>
        <span className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-yellow-400 rounded"></div>
          <span>Booked (Other)</span>
        </span>
      </div>

      {/* Seat Layout */}
      <div className="grid grid-cols-5 md:grid-cols-6 gap-2 justify-center">
        {rows.map((row) => (
          <div key={row} className="flex items-center space-x-2">
            {cols.map((col) => {
              const seat = `${row}${col}`;
              return col !== "" ? renderSeat(seat, seats[seat]) : <div key={col} className="w-4"></div>; // Add aisle space
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusSeatSelection;
