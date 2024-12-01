import React, { useState } from "react";
import { TextField, Button, Grid, Box, Alert } from "@mui/material";

const SearchForm = ({ onSearch, disabled }) => {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError(""); // Clear error when user makes changes
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

    // Validate that source and destination are different
    if (formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      setFormError("Source and destination cannot be the same");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Format the date to ensure it's in YYYY-MM-DD format
      const formattedData = {
        ...formData,
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        date: formData.date, // Already in YYYY-MM-DD format from input
        time: formData.time || undefined
      };
      onSearch(formattedData);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Box p={3}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {formError && (
            <Grid item xs={12}>
              <Alert severity="error">{formError}</Alert>
            </Grid>
          )}
          
          {disabled && (
            <Grid item xs={12}>
              <Alert severity="warning">
                Waiting for server connection... Please wait.
              </Alert>
            </Grid>
          )}
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="source"
              label="Source City"
              fullWidth
              required
              value={formData.source}
              onChange={handleChange}
              error={formError.includes("Source")}
              disabled={disabled}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="destination"
              label="Destination City"
              fullWidth
              required
              value={formData.destination}
              onChange={handleChange}
              error={formError.includes("Destination")}
              disabled={disabled}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Journey Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              inputProps={{ min: today }}
              error={formError.includes("Date")}
              disabled={disabled}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="time"
              label="Preferred Time (Optional)"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={handleChange}
              inputProps={{ step: 300 }} // 5-minute intervals
              disabled={disabled}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              disabled={disabled}
            >
              {disabled ? "Connecting to Server..." : "Search Buses"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SearchForm;
