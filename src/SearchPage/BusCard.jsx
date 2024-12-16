import React from 'react';
import { FaMapMarkerAlt, FaClock, FaRupeeSign } from 'react-icons/fa';

const BusCard = ({ bus }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-primary-100">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-800 font-poppins">{bus.name}</h3>
        <span className="px-3 py-1 text-sm rounded-full bg-primary-50 text-primary-600">
          {bus.status}
        </span>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="text-primary-500 mr-2" />
          <span className="font-medium font-roboto">Route:</span>
          <span className="ml-2">{bus.route}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <FaClock className="text-primary-500 mr-2" />
          <div className="flex flex-col">
            <div>
              <span className="font-medium font-roboto">Departure:</span>
              <span className="ml-2">{bus.departureTime}</span>
            </div>
            <div>
              <span className="font-medium font-roboto">Arrival:</span>
              <span className="ml-2">{bus.arrivalTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <FaRupeeSign className="text-primary-500 mr-2" />
          <span className="font-medium font-roboto">Price:</span>
          <span className="ml-2 text-lg text-primary-600">₹{bus.price}</span>
        </div>

        {bus.seatsAvailable && (
          <p className="text-sm text-gray-500">
            {bus.seatsAvailable} seats available
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {bus.rating && (
            <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded text-sm">
              ★ {bus.rating}
            </span>
          )}
          <span className="text-sm text-gray-500">{bus.coachName}</span>
        </div>
        <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300 font-medium font-poppins">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BusCard;
