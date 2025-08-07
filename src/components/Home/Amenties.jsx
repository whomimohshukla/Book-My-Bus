import React from "react";
import CTAButton from "../../Utls/Home/Button";
import {
  FaWifi,
  FaSnowflake,
  FaChargingStation,
  FaFilm,
  FaFirstAid,
  FaGlassWhiskey,
  FaToilet,
  FaUmbrella,
  FaLightbulb,
  FaHeadphones,
  FaBed,
  FaLeaf
} from "react-icons/fa";

const amenities = [
  {
    icon: <FaWifi />,
    title: "Free Wi-Fi",
    description: "Stay connected throughout your journey"
  },
  {
    icon: <FaSnowflake />,
    title: "Air Conditioning",
    description: "Travel in comfort with climate control"
  },
  {
    icon: <FaChargingStation />,
    title: "Charging Points",
    description: "Keep your devices powered up"
  },
  {
    icon: <FaFilm />,
    title: "Entertainment",
    description: "Enjoy movies and music on-board"
  },
  {
    icon: <FaFirstAid />,
    title: "First Aid",
    description: "Emergency medical kit available"
  },
  {
    icon: <FaGlassWhiskey />,
    title: "Refreshments",
    description: "Complimentary snacks and drinks"
  },
  {
    icon: <FaToilet />,
    title: "Clean Restroom",
    description: "Well-maintained facilities"
  },
  {
    icon: <FaUmbrella />,
    title: "Insurance",
    description: "Travel protection included"
  },
  {
    icon: <FaLightbulb />,
    title: "Reading Lights",
    description: "Individual adjustable lights"
  },
  {
    icon: <FaHeadphones />,
    title: "Noise Control",
    description: "Peaceful journey experience"
  },
  {
    icon: <FaBed />,
    title: "Reclining Seats",
    description: "Comfortable seating arrangement"
  },
  {
    icon: <FaLeaf />,
    title: "Air Purifier",
    description: "Clean and fresh air circulation"
  }
];

function AmenityCard({ icon, title, description }) {
  return (
    <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-14 h-14 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-Darkgreen transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function Amenities() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Premium
            <span className="text-Darkgreen"> Amenities</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience luxury and comfort with our top-class bus amenities designed for your convenience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {amenities.map((amenity, index) => (
            <AmenityCard
              key={index}
              icon={amenity.icon}
              title={amenity.title}
              description={amenity.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg mb-8">
            All amenities are subject to availability and may vary by bus type
          </p>
          <CTAButton active={true} linkto="/features" className="px-8 py-3">
             View All Features
           </CTAButton>
        </div>
      </div>
    </div>
  );
}

export default Amenities;
