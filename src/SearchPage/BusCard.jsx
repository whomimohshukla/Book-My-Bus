import React from 'react';

const BusCard = ({ bus }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800">{bus.name}</h3>
      <div className="mt-4">
        <p className="text-gray-600">
          <span className="font-medium">Route:</span> {bus.route}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Departure:</span> {bus.departure}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Arrival:</span> {bus.arrival}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Price:</span> ${bus.price}
        </p>
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Book Now
      </button>
    </div>
  );
};

export default BusCard;
