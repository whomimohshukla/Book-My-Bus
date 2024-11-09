import React from "react";
import {
  FaWifi,
  FaCoffee,
  FaChargingStation,
  FaTv,
  FaMapMarkedAlt,
} from "react-icons/fa";

function Amenities() {
  return (
    <div className="text-center -mt-52 mb-20 font-poppins bg-gray-100 p-6 md:p-12 text-gray-800">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
        Our Amenities
      </h1>
      <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600 px-4 md:px-0">
        Enjoy a comfortable and convenient journey with our top amenities!
      </p>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 px-4 md:px-0">
        {/* WiFi */}
        <div className="flex flex-col items-center">
          <div className="bg-lightblue p-4 sm:p-6 shadow-lg rounded-md flex flex-col items-center transition transform hover:shadow-xl hover:-translate-y-2 duration-300">
            <FaWifi className="text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-2 md:mb-4 hover:text-simon" />
            <h2 className="text-base md:text-lg font-bold">Free WiFi</h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base">
              Stay connected throughout your journey.
            </p>
          </div>
        </div>

        {/* GPS Tracking */}
        <div className="flex flex-col items-center">
          <div className="bg-lightblue p-4 sm:p-6 shadow-lg rounded-md flex flex-col items-center transition transform hover:shadow-xl hover:-translate-y-2 duration-300">
            <FaMapMarkedAlt className="text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-2 md:mb-4 hover:text-simon" />
            <h2 className="text-base md:text-lg font-bold">GPS Tracking</h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base">
              Track your route in real-time.
            </p>
          </div>
        </div>

        {/* Charging Stations */}
        <div className="flex flex-col items-center">
          <div className="bg-lightblue p-4 sm:p-6 shadow-lg rounded-md flex flex-col items-center transition transform hover:shadow-xl hover:-translate-y-2 duration-300">
            <FaChargingStation className="text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-2 md:mb-4 hover:text-simon" />
            <h2 className="text-base md:text-lg font-bold">Charging Stations</h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base">
              Keep your devices fully charged on the go.
            </p>
          </div>
        </div>

        {/* TV */}
        <div className="flex flex-col items-center">
          <div className="bg-lightblue p-4 sm:p-6 shadow-lg rounded-md flex flex-col items-center transition transform hover:shadow-xl hover:-translate-y-2 duration-300">
            <FaTv className="text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-2 md:mb-4 hover:text-simon" />
            <h2 className="text-base md:text-lg font-bold">Onboard TV</h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base">
              Enjoy entertainment throughout your ride.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Amenities;
