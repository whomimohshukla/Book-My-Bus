import React from "react";
import { FaWifi, FaSnowflake, FaChargingStation, FaFilm, FaFirstAid, FaGlassWhiskey, FaToilet, FaUmbrella, FaLightbulb, FaHeadphones, FaBed, FaLeaf } from "react-icons/fa";
// Removed duplicate Amenities import
import CTAButton from "../../Utls/Home/Button";

/* Card for individual amenity */
function AmenityCard({ icon, title, description }) {
  return (
    <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center">
      <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-Darkgreen transition-colors duration-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}

const amenities = [
  { icon: <FaWifi />, title: "Free Wi-Fi", description: "Stay connected throughout your journey" },
  { icon: <FaSnowflake />, title: "Air Conditioning", description: "Travel in comfort with climate control" },
  { icon: <FaChargingStation />, title: "Charging Points", description: "Keep your devices powered up" },
  { icon: <FaFilm />, title: "Entertainment", description: "Enjoy movies and music on-board" },
  { icon: <FaFirstAid />, title: "First Aid", description: "Emergency medical kit available" },
  { icon: <FaGlassWhiskey />, title: "Refreshments", description: "Complimentary snacks and drinks" },
  { icon: <FaToilet />, title: "Clean Restroom", description: "Well-maintained facilities" },
  { icon: <FaUmbrella />, title: "Insurance", description: "Travel protection included" },
  { icon: <FaLightbulb />, title: "Reading Lights", description: "Individual adjustable lights" },
  { icon: <FaHeadphones />, title: "Noise Control", description: "Peaceful journey experience" },
  { icon: <FaBed />, title: "Reclining Seats", description: "Comfortable seating arrangement" },
  { icon: <FaLeaf />, title: "Air Purifier", description: "Clean and fresh air circulation" },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All <span className="text-Darkgreen">Features & Amenities</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore the complete range of premium amenities available on BookMyBus coaches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {amenities.map((amenity, index) => (
            <AmenityCard key={index} {...amenity} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <CTAButton active={true} linkto="/searchBuses" className="px-10 py-4">
            Book a Bus Now
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

export default FeaturesPage;
