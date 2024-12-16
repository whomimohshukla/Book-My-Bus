import React, { useState } from "react";
import axios from "axios";
import { Container, Paper, Alert, Snackbar } from "@mui/material";
import {
  FaBus, FaMapMarkerAlt, FaRoute, FaUserFriends, FaPhoneAlt,
  FaCalendarAlt, FaExchangeAlt, FaSearch, FaTicketAlt, FaStar,
  FaShieldAlt, FaRegCreditCard
} from "react-icons/fa";
import { MdEventSeat, MdLocalOffer } from "react-icons/md";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import Loader from "./Loader";

// API Configuration
const API_BASE_URL = "http://localhost:8000/api/searchBuses";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/buses/search", {
        params: formData,
      });

      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
      } else if (response.data && response.data.data) {
        setResults(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setResults([]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.response ? `Server error: ${error.response.status}` :
        error.request ? "No response from server. Please check your connection." :
        error.message;
      
      setError(`Failed to fetch bus data. ${errorMessage}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section with Background Pattern */}
      <div className="relative bg-gradient-to-r from-Darkgreen to-green-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <Container maxWidth="xl" className="relative py-16">
          <div className="text-center text-white space-y-4 mb-12">
            <h1 className="text-5xl font-bold tracking-tight">
              Book Your Journey
            </h1>
            <p className="text-xl text-green-100">
              Travel with comfort and convenience
            </p>
          </div>

          {/* Search Form Card */}
          <div className="max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
            <Paper
              elevation={6}
              className="rounded-xl overflow-hidden border border-green-100/20"
            >
              <SearchForm onSearch={handleSearch} />
            </Paper>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-4 gap-8 text-white text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-2xl mb-2 text-green-300" />
              <span className="text-sm">Secure Booking</span>
            </div>
            <div className="flex flex-col items-center">
              <FaRegCreditCard className="text-2xl mb-2 text-green-300" />
              <span className="text-sm">Easy Payment</span>
            </div>
            <div className="flex flex-col items-center">
              <FaStar className="text-2xl mb-2 text-green-300" />
              <span className="text-sm">Best Prices</span>
            </div>
            <div className="flex flex-col items-center">
              <FaTicketAlt className="text-2xl mb-2 text-green-300" />
              <span className="text-sm">Instant Tickets</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl text-center transform hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
                <FaUserFriends className="text-2xl text-Darkgreen" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">1M+</div>
              <div className="text-sm text-gray-600">Happy Travelers</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl text-center transform hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
                <FaBus className="text-2xl text-Darkgreen" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600">Bus Partners</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl text-center transform hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
                <FaRoute className="text-2xl text-Darkgreen" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">2000+</div>
              <div className="text-sm text-gray-600">Routes</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl text-center transform hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
                <FaPhoneAlt className="text-2xl text-Darkgreen" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
          </div>
        </Container>
      </div>

      {/* Results or Popular Routes */}
      <Container maxWidth="xl" className="py-12">
        {loading && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        
        {!loading && results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Buses
            </h2>
            <SearchResults results={results} />
          </div>
        )}
        
        {!loading && results.length === 0 && !error && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Popular Routes
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {[
                "Mumbai → Pune",
                "Delhi → Agra",
                "Bangalore → Mysore",
                "Chennai → Pondicherry",
                "Hyderabad → Vijayawada"
              ].map((route, index) => (
                <button
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-green-50 to-white rounded-full
                           text-gray-700 font-medium shadow-sm border border-green-100
                           hover:shadow-md hover:border-green-200 transition-all duration-300"
                >
                  {route}
                </button>
              ))}
            </div>
          </div>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default SearchPage;
