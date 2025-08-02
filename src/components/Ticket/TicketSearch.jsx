import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFilter, FaBus, FaCalendarAlt, FaMapSigns,
  FaRupeeSign, FaRegClock, FaMapMarkerAlt, FaWifi, FaSnowflake,
  FaChargingStation, FaToilet, FaExchangeAlt, FaSearch, FaStar,
  FaShieldAlt, FaUserFriends, FaRoute, FaImage, FaTicketAlt,
  FaLightbulb, FaNewspaper, FaBusAlt, FaPhoneAlt, FaWhatsapp,
  FaRegBookmark, FaRegThumbsUp, FaAward, FaRegCreditCard
} from "react-icons/fa";
import { BiDrink, BiHelpCircle } from "react-icons/bi";
import { MdEventSeat, MdLocalOffer, MdLocationCity, MdFeedback } from "react-icons/md";

const TicketSearch = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  
  // New states for search
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");
  const [popularCities] = useState([
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Goa"
  ]);

  // Function to swap locations
  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const vehicleTypeOptions = ["Classic", "Coach", "AC"];
  const scheduleOptions = [
    { label: "7:00 AM - 9:00 AM", value: "7-9" },
    { label: "9:00 AM - 11:00 AM", value: "9-11" },
    { label: "11:00 AM - 1:00 PM", value: "11-1" },
    { label: "1:00 PM - 3:00 PM", value: "1-3" },
    { label: "3:00 PM - 5:00 PM", value: "3-5" },
    { label: "5:00 PM - 7:00 PM", value: "5-7" },
    { label: "7:00 PM - 9:00 PM", value: "7-9-evening" },
  ];
  const routeOptions = ["Route A", "Route B", "Route C"];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const simulatedResults = [
        {
          id: "001",
          name: "VRL Volvo A/C Sleeper",
          status: "Available",
          category: "A/C Sleeper",
          vehicle: "Volvo Multi-Axle",
          schedule: "7-9",
          route: "Mumbai - Pune",
          seatChoice: "2 x 1",
          departureTime: "07:00 AM",
          arrivalTime: "10:30 AM",
          duration: "3.5 hours",
          startLocation: "Mumbai Central",
          endLocation: "Pune Station",
          price: 850,
          seatsAvailable: 23,
          rating: 4.5,
          coachName: "VRL Travels",
          offDays: ["Thursday"],
          facilities: ["AC", "WiFi", "Charging Point", "Water", "Blanket"],
        },
        {
          id: "002",
          name: "Orange Travels Semi-Sleeper",
          status: "Almost Full",
          category: "A/C Semi Sleeper",
          vehicle: "Scania",
          schedule: "9-11",
          route: "Delhi - Jaipur",
          seatChoice: "2 x 2",
          departureTime: "04:00 PM",
          arrivalTime: "10:00 PM",
          duration: "6 hours",
          startLocation: "Delhi ISBT",
          endLocation: "Jaipur Central",
          price: 1200,
          seatsAvailable: 5,
          rating: 4.8,
          coachName: "Orange Travels",
          offDays: ["Monday"],
          facilities: ["AC", "WiFi", "Charging Point", "Water", "Entertainment"],
        },
      ];

      const filteredResults = simulatedResults.filter((ticket) => {
        return (
          (vehicleTypes.length === 0 || vehicleTypes.includes(ticket.vehicle)) &&
          (selectedSchedule === "" || ticket.schedule === selectedSchedule) &&
          (selectedRoute === "" || ticket.route === selectedRoute)
        );
      });

      // Sort results
      const sortedResults = [...filteredResults].sort((a, b) => {
        switch (sortBy) {
          case "price":
            return a.price - b.price;
          case "departure":
            return a.departureTime.localeCompare(b.departureTime);
          case "duration":
            return a.duration.localeCompare(b.duration);
          case "rating":
            return b.rating - a.rating;
          default:
            return 0;
        }
      });

      setResults(sortedResults);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleSearch();
  }, [vehicleTypes, selectedSchedule, selectedRoute, sortBy]);

  const getFacilityIcon = (facility) => {
    switch (facility.toLowerCase()) {
      case "wifi":
        return <FaWifi className="text-gray-600" title="WiFi" />;
      case "ac":
        return <FaSnowflake className="text-gray-600" title="AC" />;
      case "charging point":
        return <FaChargingStation className="text-gray-600" title="Charging Point" />;
      case "water":
        return <BiDrink className="text-gray-600" title="Water" />;
      case "toilet":
        return <FaToilet className="text-gray-600" title="Toilet" />;
      default:
        return null;
    }
  };

  // Add new dummy data for featured routes and offers
  const featuredRoutes = [
    {
      from: "Mumbai",
      to: "Pune",
      price: 450,
      duration: "3h 30m",
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66",
      discount: "15% OFF",
      frequency: "100+ buses daily"
    },
    {
      from: "Delhi",
      to: "Agra",
      price: 550,
      duration: "4h",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
      discount: "10% OFF",
      frequency: "80+ buses daily"
    },
    {
      from: "Bangalore",
      to: "Mysore",
      price: 350,
      duration: "3h",
      image: "https://images.unsplash.com/photo-1600689520070-bca431b6c1fd",
      discount: "20% OFF",
      frequency: "90+ buses daily"
    }
  ];

  const specialOffers = [
    {
      title: "First Trip Discount",
      code: "FIRST500",
      discount: "₹500 OFF",
      maxDiscount: "Up to ₹500",
      validTill: "31 Dec, 2024"
    },
    {
      title: "Student Special",
      code: "STUDENT20",
      discount: "20% OFF",
      maxDiscount: "Up to ₹200",
      validTill: "31 Dec, 2024"
    }
  ];

  const busAmenities = [
    { icon: <FaWifi />, name: "Free WiFi" },
    { icon: <FaSnowflake />, name: "AC" },
    { icon: <FaChargingStation />, name: "Charging Point" },
    { icon: <MdEventSeat />, name: "Reclining Seats" },
    { icon: <BiDrink />, name: "Water Bottle" },
    { icon: <FaToilet />, name: "Clean Washroom" }
  ];

  // Add new dummy data for customer reviews
  const customerReviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Very comfortable journey from Mumbai to Pune. AC was working perfectly and staff was helpful.",
      date: "2 days ago",
      route: "Mumbai to Pune",
      verified: true
    },
    {
      name: "Priya Sharma",
      rating: 4,
      comment: "Good experience with VRL Travels. Bus was clean and on time.",
      date: "1 week ago",
      route: "Bangalore to Chennai",
      verified: true
    },
    {
      name: "Amit Patel",
      rating: 5,
      comment: "Excellent service on Volvo bus. Punctual departure and arrival.",
      date: "3 days ago",
      route: "Delhi to Jaipur",
      verified: true
    }
  ];

  // Add popular bus operators data
  const popularOperators = [
    {
      name: "VRL Travels",
      rating: 4.5,
      trips: "5000+",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
      features: ["AC Sleeper", "GPS Tracking", "Emergency Contact"]
    },
    {
      name: "SRS Travels",
      rating: 4.3,
      trips: "4000+",
      image: "https://images.unsplash.com/photo-1562620744-0b00c177da4c",
      features: ["Multi-Axle Volvo", "Entertainment", "Snacks"]
    },
    {
      name: "Orange Travels",
      rating: 4.4,
      trips: "4500+",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e",
      features: ["AC Seater", "USB Charging", "WiFi"]
    }
  ];

  // Add travel tips data
  const travelTips = [
    {
      title: "Monsoon Travel",
      description: "Check weather updates during monsoon season and carry rain gear",
      icon: <FaRegBookmark />
    },
    {
      title: "Festival Season",
      description: "Book tickets well in advance during festival seasons like Diwali",
      icon: <FaRegThumbsUp />
    },
    {
      title: "Night Journey",
      description: "Opt for sleeper buses for overnight journeys for better comfort",
      icon: <FaLightbulb />
    }
  ];

  // Add popular travel guides
  const travelGuides = [
    {
      title: "Weekend Trips from Mumbai",
      description: "Explore Lonavala, Alibaug, and Matheran",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
      readTime: "5 min read"
    },
    {
      title: "Temple Tourism",
      description: "Guide to famous temples in South India",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
      readTime: "4 min read"
    },
    {
      title: "Hill Station Getaways",
      description: "Top hill stations to visit in India",
      image: "https://images.unsplash.com/photo-1544389233-a737e7f82a53",
      readTime: "3 min read"
    }
  ];

  return (
    <div className="container mx-auto mt-5 p-4">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white2 mb-4">
              Book Your Bus Tickets
            </h1>
            <p className="text-lg text-white2/90">
              Travel safely and comfortably across India
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white2 rounded-lg shadow-xl p-4 md:p-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-end">
              {/* From Location */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-Darkgreen"
                  />
                  {fromLocation && (
                    <div className="absolute z-20 w-full mt-1 bg-white2 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {popularCities
                        .filter(city => 
                          city.toLowerCase().includes(fromLocation.toLowerCase())
                        )
                        .map((city, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setFromLocation(city)}
                          >
                            {city}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="hidden lg:flex justify-center">
                <button
                  onClick={swapLocations}
                  className="p-3 rounded-full bg-gray-100 text-Darkgreen hover:bg-gray-200 transition-colors"
                  aria-label="Swap locations"
                >
                  <FaExchangeAlt className="transform -rotate-90" />
                </button>
              </div>

              {/* To Location */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-Darkgreen"
                  />
                  {toLocation && (
                    <div className="absolute z-20 w-full mt-1 bg-white2 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {popularCities
                        .filter(city => 
                          city.toLowerCase().includes(toLocation.toLowerCase())
                        )
                        .map((city, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setToLocation(city)}
                          >
                            {city}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Date Picker */}
              <div className="sm:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-Darkgreen"
                />
              </div>

              {/* Search Button */}
              <div className="sm:col-span-1">
                <button
                  onClick={handleSearch}
                  className="w-full bg-Darkgreen hover:bg-LightGreen text-white2 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaSearch className="mr-2" />
                  Search
                </button>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="mt-6">
              <h3 className="text-gray-700 text-sm font-medium mb-2">Popular Routes:</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Mumbai → Pune",
                  "Delhi → Agra",
                  "Bangalore → Mysore",
                  "Chennai → Pondicherry",
                  "Hyderabad → Vijayawada"
                ].map((route, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {route}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white2 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-Darkgreen mb-1">1M+</div>
            <div className="text-sm text-gray-600">Happy Travelers</div>
          </div>
          <div className="bg-white2 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-Darkgreen mb-1">500+</div>
            <div className="text-sm text-gray-600">Bus Partners</div>
          </div>
          <div className="bg-white2 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-Darkgreen mb-1">2000+</div>
            <div className="text-sm text-gray-600">Routes</div>
          </div>
          <div className="bg-white2 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-Darkgreen mb-1">24/7</div>
            <div className="text-sm text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>

      {/* Featured Routes Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <FaRoute className="mr-2" /> Featured Routes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRoutes.map((route, index) => (
            <div key={index} className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md">
              <img
                src={route.image}
                alt={`${route.from} to ${route.to}`}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white2">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-lg font-semibold">{route.from} → {route.to}</h3>
                      <p className="text-sm opacity-90">Starting from ₹{route.price}</p>
                      <div className="flex items-center mt-1 text-xs space-x-2">
                        <span>{route.duration}</span>
                        <span>•</span>
                        <span>{route.frequency}</span>
                      </div>
                    </div>
                    <div className="bg-red-500 text-white2 px-2 py-1 rounded text-sm font-semibold">
                      {route.discount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <MdLocalOffer className="mr-2" /> Special Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialOffers.map((offer, index) => (
            <div key={index} className="border border-dashed border-Darkgreen rounded-lg p-4 bg-green-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-Darkgreen">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Use code: <span className="font-mono font-bold">{offer.code}</span></p>
                  <p className="text-sm text-gray-600 mt-1">{offer.maxDiscount}</p>
                  <p className="text-xs text-gray-500 mt-2">Valid till {offer.validTill}</p>
                </div>
                <div className="text-2xl font-bold text-red-500">{offer.discount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bus Amenities Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <FaBus className="mr-2" /> Bus Amenities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {busAmenities.map((amenity, index) => (
            <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-3xl text-Darkgreen mb-2">
                {amenity.icon}
              </div>
              <span className="text-sm text-gray-700 text-center">{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Measures Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <FaShieldAlt className="mr-2" /> Safety First
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl text-Darkgreen">
              <FaShieldAlt />
            </div>
            <div>
              <h3 className="font-semibold">Sanitized Buses</h3>
              <p className="text-sm text-gray-600">Regular sanitization of all buses</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl text-Darkgreen">
              <FaUserFriends />
            </div>
            <div>
              <h3 className="font-semibold">Social Distancing</h3>
              <p className="text-sm text-gray-600">Maintained seating arrangement</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl text-Darkgreen">
              <FaTicketAlt />
            </div>
            <div>
              <h3 className="font-semibold">Contactless Booking</h3>
              <p className="text-sm text-gray-600">Online tickets and payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Bus Operators Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <FaBusAlt className="mr-2" /> Popular Bus Operators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularOperators.map((operator, index) => (
            <div key={index} className="bg-white2 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={operator.image}
                alt={operator.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-Darkgreen">{operator.name}</h3>
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{operator.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{operator.trips} trips completed</p>
                <div className="flex flex-wrap gap-2">
                  {operator.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <MdFeedback className="mr-2" /> Customer Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((review, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{review.name}</h3>
                  <p className="text-sm text-gray-600">{review.route}</p>
                </div>
                <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{review.rating}.0</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{review.date}</span>
                {review.verified && (
                  <span className="flex items-center text-green-600">
                    <FaAward className="mr-1" /> Verified User
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <FaLightbulb className="mr-2" /> Travel Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {travelTips.map((tip, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <div className="text-3xl text-Darkgreen mb-4">
                {tip.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Guides Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <FaNewspaper className="mr-2" /> Travel Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {travelGuides.map((guide, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative rounded-lg overflow-hidden mb-3">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-Darkgreen transition-colors">
                {guide.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{guide.description}</p>
              <span className="text-xs text-gray-500">{guide.readTime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help & Support Section */}
      <div className="mb-12 bg-white2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-Darkgreen mb-6 flex items-center">
          <BiHelpCircle className="mr-2" /> Help & Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
            <FaPhoneAlt className="text-2xl text-Darkgreen" />
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-600">1800-123-4567</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
            <FaWhatsapp className="text-2xl text-Darkgreen" />
            <div>
              <h3 className="font-semibold">WhatsApp Support</h3>
              <p className="text-sm text-gray-600">+91 98765-43210</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
            <FaRegCreditCard className="text-2xl text-Darkgreen" />
            <div>
              <h3 className="font-semibold">Refund Status</h3>
              <p className="text-sm text-gray-600">Track your refund</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
            <MdLocationCity className="text-2xl text-Darkgreen" />
            <div>
              <h3 className="font-semibold">Regional Office</h3>
              <p className="text-sm text-gray-600">Find nearest office</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="col-span-1 md:col-span-1">
          <div className="bg-white2 rounded-lg shadow-md p-4 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-Darkgreen flex items-center">
                <FaFilter className="mr-2" /> Filters
              </h4>
              <button
                onClick={() => {
                  setVehicleTypes([]);
                  setSelectedSchedule("");
                  setSelectedRoute("");
                }}
                className="text-red-500 text-sm hover:text-red-600 font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Vehicle Type Filter */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 flex items-center text-gray-700">
                <FaBus className="mr-2" /> Vehicle Type
              </h5>
              <div className="space-y-2">
                {vehicleTypeOptions.map((vehicle) => (
                  <label
                    key={vehicle}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      value={vehicle}
                      checked={vehicleTypes.includes(vehicle)}
                      onChange={(e) => handleVehicleTypeChange(e)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{vehicle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedule Filter */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 flex items-center text-gray-700">
                <FaCalendarAlt className="mr-2" /> Departure Time
              </h5>
              <div className="space-y-2">
                {scheduleOptions.map((schedule) => (
                  <label
                    key={schedule.value}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="schedule"
                      value={schedule.value}
                      checked={selectedSchedule === schedule.value}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{schedule.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Route Filter */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 flex items-center text-gray-700">
                <FaMapSigns className="mr-2" /> Route
              </h5>
              <div className="space-y-2">
                {routeOptions.map((route) => (
                  <label
                    key={route}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="route"
                      value={route}
                      checked={selectedRoute === route}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{route}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-span-3">
          {/* Sort Options */}
          <div className="bg-white2 rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-Darkgreen">Available Buses</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-LightGreen"
                >
                  <option value="price">Price</option>
                  <option value="departure">Departure Time</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white2 rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Darkgreen"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-Darkgreen">
                            {ticket.coachName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {ticket.vehicle} • {ticket.seatChoice} Seating
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm bg-green-100 text-Darkgreen px-3 py-1 rounded-full">
                            {ticket.status}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {ticket.seatsAvailable} seats available
                          </div>
                        </div>
                      </div>

                      {/* Journey Details */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-2xl font-bold text-Darkgreen">
                            {ticket.departureTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            <FaMapMarkerAlt className="inline mr-1" />
                            {ticket.startLocation}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">
                            <FaRegClock className="inline mr-1" />
                            {ticket.duration}
                          </div>
                          <div className="border-t border-b border-gray-300 my-2"></div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-Darkgreen">
                            {ticket.arrivalTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            <FaMapMarkerAlt className="inline mr-1" />
                            {ticket.endLocation}
                          </div>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex items-center space-x-4 mb-4">
                        {ticket.facilities.map((facility, index) => (
                          <div
                            key={index}
                            className="flex items-center text-gray-600"
                            title={facility}
                          >
                            {getFacilityIcon(facility)}
                          </div>
                        ))}
                      </div>

                      {/* Price and Actions */}
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <div className="text-2xl font-bold text-Darkgreen flex items-center">
                            <FaRupeeSign className="text-xl" />
                            {ticket.price}
                          </div>
                          <div className="text-sm text-gray-600">Per seat</div>
                        </div>
                        <div className="space-x-3">
                          <Link
                            to="/seatSelection"
                            className="inline-block bg-Darkgreen text-white2 px-6 py-2 rounded-lg hover:bg-LightGreen transition-colors duration-200"
                          >
                            Select Seats
                          </Link>
                          <button className="text-Darkgreen hover:text-LightGreen font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white2 rounded-lg shadow-md p-8 text-center">
                  <div className="text-gray-600 text-lg">No buses found</div>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSearch;
