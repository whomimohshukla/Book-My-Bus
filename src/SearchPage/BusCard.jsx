import React from 'react';
import { 
  FaMapMarkerAlt, FaClock, FaRupeeSign, FaWifi, FaSnowflake, 
  FaChargingStation, FaToilet, FaRoute, FaStar, FaCouch,
  FaCoffee, FaTv, FaMusic, FaFirstAid, FaAward
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const BusCard = ({ bus }) => {
  const amenities = [
    { icon: <FaWifi />, label: 'WiFi' },
    { icon: <FaSnowflake />, label: 'AC' },
    { icon: <FaChargingStation />, label: 'Charging Point' },
    { icon: <FaToilet />, label: 'Toilet' },
    { icon: <FaMusic />, label: 'Entertainment' },
    { icon: <FaFirstAid />, label: 'First Aid' }
  ].filter(amenity => bus.amenities?.includes(amenity.label));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Status Banner */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen px-8 py-2.5 text-white">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {bus.seatsAvailable} seats available
          </span>
          <span className="text-sm font-medium flex items-center gap-1">
            <FaStar className="text-yellow-300" />
            {bus.rating}
          </span>
        </div>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 font-poppins flex items-center gap-2">
              {bus.name}
              {bus.premium && <FaAward className="text-yellow-500" title="Premium Service" />}
            </h3>
            <p className="text-base text-gray-500 mt-1">{bus.coachName}</p>
          </div>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-1.5 text-sm rounded-full bg-green-50 text-Darkgreen font-medium"
          >
            {bus.status}
          </motion.span>
        </div>

        {/* Route and Time Details */}
        <div className="space-y-6">
          <div className="flex items-start gap-4 text-gray-600">
            <FaRoute className="text-Darkgreen mt-1 text-xl" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg text-gray-900">{bus.route.split(' to ')[0]}</p>
                  <p className="text-base">{bus.departureTime}</p>
                </div>
                <div className="text-center px-6">
                  <div className="w-32 h-px bg-gray-300 relative">
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-Darkgreen rounded-full" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{bus.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg text-gray-900">{bus.route.split(' to ')[1]}</p>
                  <p className="text-base">{bus.arrivalTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {amenities.map((amenity, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-base text-gray-600 bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <span className="text-Darkgreen text-lg">{amenity.icon}</span>
                  <span>{amenity.label}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Price and Booking */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-Darkgreen">₹{bus.price}</span>
            {bus.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{bus.originalPrice}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-Darkgreen text-white px-6 py-2.5 rounded-lg hover:bg-LightGreen transition-colors duration-300 font-medium font-poppins flex items-center gap-2"
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BusCard;
