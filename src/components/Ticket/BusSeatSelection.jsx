import React, { useState } from "react";
import { BsFillSquareFill } from "react-icons/bs";
import { GiSteeringWheel } from "react-icons/gi";

const BusSeatSelection = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const cols = [1, 2, "", 3, 4];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState(
    rows.reduce((acc, row) => {
      cols.forEach((col) => {
        if (col !== "") {
          acc[`${row}${col}`] = {
            status: "available",
            price: Math.floor(Math.random() * (1200 - 800 + 1)) + 800,
            gender: null
          };
        }
      });
      return acc;
    }, {})
  );

  const handleSeatClick = (seat) => {
    setSeats((prevSeats) => {
      const currentSeat = prevSeats[seat];
      if (currentSeat.status === "available") {
        setSelectedSeats([...selectedSeats, seat]);
        return {
          ...prevSeats,
          [seat]: { ...currentSeat, status: "selected" }
        };
      }
      if (currentSeat.status === "selected") {
        setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        return {
          ...prevSeats,
          [seat]: { ...currentSeat, status: "available" }
        };
      }
      return prevSeats;
    });
  };

  const renderSeat = (seat, seatData) => {
    const { status, price } = seatData;
    let seatClass = "border ";
    
    switch (status) {
      case "available":
        seatClass += "bg-white hover:bg-gray-100 cursor-pointer";
        break;
      case "selected":
        seatClass += "bg-[#51B46D] text-white cursor-pointer";
        break;
      case "bookedMale":
        seatClass += "bg-[#4B4B4B] text-white cursor-not-allowed";
        break;
      case "bookedFemale":
        seatClass += "bg-[#F0608F] text-white cursor-not-allowed";
        break;
      default:
        seatClass += "bg-gray-200 cursor-not-allowed";
    }

    return (
      <div
        key={seat}
        className="relative group"
        onClick={() => (status === "available" || status === "selected") ? handleSeatClick(seat) : null}
      >
        <div className={`w-8 h-8 ${seatClass} rounded-t-lg flex items-center justify-center transform transition-transform duration-200 ${status === "available" ? "hover:scale-105" : ""}`}>
          <BsFillSquareFill className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-5 left-0 w-8 text-[10px] text-center text-gray-600">
          ₹{price}
        </div>
        {/* Tooltip */}
        <div className="absolute hidden group-hover:block bg-black text-white text-xs py-1 px-2 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
          Seat {seat} - ₹{price}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Select Seats</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#51B46D] rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#4B4B4B] rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#F0608F] rounded"></div>
              <span>Ladies</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Bus Frame */}
          <div className="relative bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
            {/* Driver Section */}
            <div className="absolute -left-2 top-8 bg-gray-200 p-2 rounded">
              <GiSteeringWheel className="text-gray-600 w-6 h-6" />
            </div>

            {/* Lower Deck */}
            <div className="relative ml-8">
              <div className="text-sm font-medium mb-4 text-gray-600">Lower Deck</div>
              <div className="grid grid-cols-5 gap-x-8 gap-y-8">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-8">
                    {cols.map((col) => {
                      const seat = `${row}${col}`;
                      return col !== "" ? (
                        renderSeat(seat, seats[seat])
                      ) : (
                        <div key={`${row}-aisle`} className="w-4" />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Selected Seats ({selectedSeats.length})</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSeats.map((seat) => (
                    <span key={seat} className="px-2 py-1 bg-[#51B46D] text-white text-sm rounded">
                      {seat} - ₹{seats[seat].price}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-xl font-bold text-gray-800">
                  ₹{selectedSeats.reduce((total, seat) => total + seats[seat].price, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSeatSelection;
