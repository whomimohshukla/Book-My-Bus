import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Paper, Alert, Snackbar } from "@mui/material";
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

    // Format the date and time for the API
    const formattedData = {
      ...formData,
      date: formData.date, // Ensure date is in YYYY-MM-DD format
      time: formData.time || undefined, // Only include time if it's provided
    };

    console.log("Sending search request with data:", formattedData);

    try {
      const response = await api.get("/buses/search", {
        params: formattedData,
      });

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
      } else if (response.data && response.data.data) {
        // Handle case where data is nested in a data property
        setResults(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setResults([]);
      }
    } catch (error) {
      console.error("API Error:", error.response || error);
      let errorMessage = "Failed to fetch bus data. ";

      if (error.response) {
        // Server responded with an error
        errorMessage +=
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage +=
          "No response from server. Please check your connection.";
      } else {
        // Error in request setup
        errorMessage += error.message;
      }

      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 4, mb: 4 }}>
        <SearchForm onSearch={handleSearch} />
      </Paper>

      {loading && <Loader />}

      {!loading && results && <SearchResults results={results} />}

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
  );
};

export default SearchPage;
