import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Grid, 
  Box, 
  Alert,
  Paper,
  Typography,
  InputAdornment,
  useTheme
} from "@mui/material";
import { 
  LocationOn,
  CalendarMonth,
  Schedule,
  SwapVert
} from "@mui/icons-material";

const SearchForm = ({ onSearch, disabled }) => {
  const theme = useTheme();
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
    setFormError("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...formData,
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        date: formData.date,
        time: formData.time || undefined
      };
      onSearch(formattedData);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Paper 
      elevation={3} 
      sx={{
        p: 4,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        borderRadius: '16px'
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: theme.palette.primary.main,
          textAlign: 'center'
        }}
      >
        Search Bus Tickets
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {formError && (
            <Grid item xs={12}>
              <Alert 
                severity="error"
                sx={{ 
                  borderRadius: '8px',
                  '& .MuiAlert-icon': { fontSize: '24px' }
                }}
              >
                {formError}
              </Alert>
            </Grid>
          )}
          
          {disabled && (
            <Grid item xs={12}>
              <Alert 
                severity="warning"
                sx={{ 
                  borderRadius: '8px',
                  '& .MuiAlert-icon': { fontSize: '24px' }
                }}
              >
                Waiting for server connection... Please wait.
              </Alert>
            </Grid>
          )}
          
          <Grid item xs={12} md={5}>
            <TextField
              name="source"
              label="From"
              fullWidth
              required
              value={formData.source}
              onChange={handleChange}
              error={formError.includes("Source")}
              disabled={disabled}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <SwapVert 
                sx={{ 
                  fontSize: '2rem',
                  color: theme.palette.primary.main,
                  transform: 'rotate(90deg)'
                }} 
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <TextField
              name="destination"
              label="To"
              fullWidth
              required
              value={formData.destination}
              onChange={handleChange}
              error={formError.includes("Destination")}
              disabled={disabled}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Journey Date"
              type="date"
              fullWidth
              required
              value={formData.date}
              onChange={handleChange}
              error={formError.includes("Date")}
              disabled={disabled}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonth color="primary" />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: today,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="time"
              label="Preferred Time"
              type="time"
              fullWidth
              value={formData.time}
              onChange={handleChange}
              disabled={disabled}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Schedule color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={disabled}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Search Buses
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SearchForm;
