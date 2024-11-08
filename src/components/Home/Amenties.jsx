import React from "react";
import {
  FaWifi,
  FaCoffee,
  FaChargingStation,
  FaTv,
  FaMapMarkedAlt,
} from "react-icons/fa";

function Amenties() {
  return (
    <div className="text-center -mt-52 mb-20 font-poppins bg-gray-100 p-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Our Amenities
      </h1>
      <p className="mt-4 text-base md:text-lg text-gray-600 px-4 md:px-0">
        Enjoy a comfortable and convenient journey with our top amenities!
      </p>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-0">
        {/* WiFi */}
        <div className="flex flex-col items-center">
          <div className="bg-lightblue p-6 shadow-lg rounded-md flex flex-col items-center">
            <FaWifi className="text-3xl md:text-4xl text-gray-800 mb-4  hover:text-simon" />
            <h2 className="text-lg font-bold">Free WiFi</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Stay connected throughout your journey.
            </p>
          </div>
        </div>

        {/* GPS Tracking */}
        <div className="flex flex-col  items-center">
          <div className="bg-lightblue p-6 shadow-lg rounded-md flex flex-col items-center">
            <FaMapMarkedAlt className="text-3xl md:text-4xl text-gray-800 mb-4  hover:text-simon" />
            <h2 className="text-lg font-bold">GPS Tracking</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Track your route in real-time.
            </p>
          </div>
        </div>
        {/* Charging Stations */}
        <div className="flex flex-col items-center">
          <div className="bg-lightblue p-6 shadow-lg rounded-md flex flex-col items-center">
            <FaChargingStation className="text-3xl md:text-4xl text-gray-800 mb-4  hover:text-simon" />
            <h2 className="text-lg font-bold">Charging Stations</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Keep your devices fully charged on the go.
            </p>
          </div>
        </div>

        {/* TV */}
        <div className="flex flex-col items-center">
          <div className="bg-lightblue p-6 shadow-lg rounded-md flex flex-col items-center">
            <FaTv className="text-3xl md:text-4xl text-gray-800 mb-4 hover:text-simon" />
            <h2 className="text-lg font-bold">Onboard TV</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Enjoy entertainment throughout your ride.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Amenties;
