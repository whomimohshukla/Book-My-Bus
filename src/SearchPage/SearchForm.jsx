import React, { useState, useEffect, useRef } from "react";

import { 
  FaExchangeAlt, FaSearch, FaMapMarkerAlt, FaCalendarAlt,
  
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const SearchForm = ({ onSearch, disabled }) => {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
  });

  const [formError, setFormError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const API_BASE_URL = "http://localhost:8000/api";

  const [popularCities] = useState([
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Goa"
  ]);

  const [sourceOptions, setSourceOptions] = useState([]);
  const [showSourceList, setShowSourceList] = useState(false);
  const [destOptions, setDestOptions] = useState([]);
  const [showDestList, setShowDestList] = useState(false);

  // debounced fetch ref
  const debounceRef = useRef({});

  const fetchSuggestions = (value, setter) => {
    if (!value.trim()) {
      setter([]);
      return;
    }
    axios
      .get(`${API_BASE_URL}/city/suggest`, { params: { q: value } })
      .then((res) => setter(res.data))
      .catch(() => setter([]));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError("");

    // fetch suggestions with 300ms debounce per field
    if (name === "source") setShowSourceList(true);
    if (name === "destination") setShowDestList(true);
    if (!debounceRef.current[name]) {
      debounceRef.current[name] = setTimeout(() => {}, 0);
    }
    clearTimeout(debounceRef.current[name]);
    debounceRef.current[name] = setTimeout(() => {
      if (name === "source") {
        fetchSuggestions(value, setSourceOptions);
      }
      if (name === "destination") {
        fetchSuggestions(value, setDestOptions);
      }
    }, 300);
  };

  const handleExchange = () => {
    setFormData(prev => ({
      ...prev,
      source: prev.destination,
      destination: prev.source
    }));
  };

  const validateForm = () => {
    if (!formData.source.trim()) {
      setFormError("Source city is required");
      return false;
    }
    if (!formData.destination.trim()) {
      setFormError("Destination city is required");
      return false;
    }
    if (!formData.date) {
      setFormError("Date is required");
      return false;
    }
    if (formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      setFormError("Source and destination cannot be the same");
      return false;
    }
    return true;
  };

  const scrollToResults = () => {
    const resultsElement = document.getElementById('searchResults');
    if (resultsElement) {
      resultsElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSearching(true);
      const formattedData = {
        ...formData,
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        date: formData.date,
        time: formData.time || undefined
      };
      
      // Add animation delay before scrolling
      await new Promise(resolve => setTimeout(resolve, 300));
      scrollToResults();
      
      onSearch(formattedData);
      setIsSearching(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-Darkgreen w-full"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white2 rounded-xl shadow-2xl p-6 backdrop-blur-lg border border-white/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 items-end">
              {/* Source City */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2">From</label>
                <div className="relative">
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    onFocus={() => setShowSourceList(true)}
                    placeholder="Enter source city"
                    className="w-full px-5 py-4 rounded-lg border-2 border-gray-100 focus:border-Darkgreen focus:outline-none font-poppins text-lg transition-all"
                    autoComplete="off"
                    disabled={disabled}
                  />
                  {/* Suggestions list */}
                  {showSourceList && (sourceOptions.length || formData.source) && (
                    <ul className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-200">
                      {(sourceOptions.length ? sourceOptions : popularCities.filter(c=>c.toLowerCase().includes(formData.source.toLowerCase()))).map((opt) => {
                        const label = opt.label || opt;
                        return (
                          <li
                            key={label}
                            className="px-4 py-2 cursor-pointer hover:bg-LightGreen hover:text-white text-gray-700"
                            onClick={() => {
                              setFormData({...formData, source: label});
                              setShowSourceList(false);
                            }}
                          >
                            {label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-Darkgreen" />
                  
                    
                </div>
              </div>

              {/* Exchange Button */}
              <div className="hidden lg:flex justify-center">
                <motion.button
                  type="button"
                  onClick={handleExchange}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 rounded-full bg-Darkgreen text-white hover:bg-LightGreen transition-all duration-300 shadow-lg"
                  disabled={disabled}
                >
                  <FaExchangeAlt className="text-xl" />
                </motion.button>
              </div>

              {/* Destination City */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2">To</label>
                <div className="relative">
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    onFocus={() => setShowDestList(true)}
                    placeholder="Enter destination city"
                    className="w-full px-5 py-4 rounded-lg border-2 border-gray-100 focus:border-Darkgreen focus:outline-none font-poppins text-lg transition-all"
                    autoComplete="off"
                    disabled={disabled}
                  />
                  {/* Suggestions list */}
                  {showDestList && (destOptions.length || formData.destination) && (
                    <ul className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-200">
                      {(destOptions.length ? destOptions : popularCities.filter(c=>c.toLowerCase().includes(formData.destination.toLowerCase()))).map((opt) => {
                        const label = opt.label || opt;
                        return (
                          <li
                            key={label}
                            className="px-4 py-2 cursor-pointer hover:bg-LightGreen hover:text-white text-gray-700"
                            onClick={() => {
                              setFormData({...formData, destination: label});
                              setShowDestList(false);
                            }}
                          >
                            {label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-Darkgreen" />
                  
                </div>
              </div>

              {/* Date Selection */}
              <div className="sm:col-span-1">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-5 py-4 rounded-lg border-2 border-gray-100 focus:border-Darkgreen focus:outline-none font-poppins text-lg transition-all"
                    disabled={disabled}
                  />
                  <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-Darkgreen" />
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-1">
                <motion.button
                  type="submit"
                  disabled={disabled || isSearching}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-Darkgreen text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:bg-LightGreen shadow-lg hover:shadow-xl text-lg h-[58px] flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Searching</span>
                    </>
                  ) : (
                    <>
                      <FaSearch className="text-xl" />
                      <span>Search</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="mt-8">
              <h3 className="text-gray-700 text-sm font-semibold mb-3">Popular Routes:</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Mumbai → Pune",
                  "Delhi → Agra",
                  "Bangalore → Mysore",
                  "Chennai → Pondicherry",
                  "Hyderabad → Vijayawada"
                ].map((route, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const [source, destination] = route.split(" → ");
                      setFormData(prev => ({ ...prev, source, destination }));
                    }}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full hover:bg-Darkgreen hover:text-white transition-all duration-300 text-sm font-medium border border-gray-200 hover:border-transparent"
                  >
                    {route}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default SearchForm;
