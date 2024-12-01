import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
  Divider,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Paper,
  Stack,
} from '@mui/material';
import {
  DirectionsBus,
  AccessTime,
  EventSeat,
  AttachMoney,
  ExpandMore,
  ExpandLess,
  Sort,
  FilterList,
  LocationOn,
  AcUnit,
  LocalCafe,
  PowerSettingsNew,
  Wifi,
  ChargingStation,
  LiveTv,
  Restaurant,
} from '@mui/icons-material';

const SearchResults = ({ results }) => {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sortResults = (items) => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.fareDetails?.baseFare || 0) - (b.fareDetails?.baseFare || 0);
        case 'duration':
          return (new Date(a.arrivalTime) - new Date(a.departureTime)) -
                 (new Date(b.arrivalTime) - new Date(b.departureTime));
        case 'departure':
          return new Date(a.departureTime) - new Date(b.departureTime);
        case 'seats':
          return b.availableSeats - a.availableSeats;
        default:
          return 0;
      }
    });
  };

  const filterResults = (items) => {
    if (filterBy === 'all') return items;
    return items.filter(bus => {
      switch (filterBy) {
        case 'ac':
          return bus.busType?.toLowerCase().includes('ac');
        case 'nonAc':
          return !bus.busType?.toLowerCase().includes('ac');
        case 'sleeper':
          return bus.busType?.toLowerCase().includes('sleeper');
        case 'seater':
          return bus.busType?.toLowerCase().includes('seater');
        default:
          return true;
      }
    });
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const calculateDuration = (departure, arrival) => {
    try {
      const start = new Date(departure);
      const end = new Date(arrival);
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 'N/A';
    }
  };

  const sortedAndFilteredResults = filterResults(sortResults(results || []));

  return (
    <Box sx={{ mt: 4 }}>
      <Paper 
        elevation={2}
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: '12px',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1, color: theme.palette.primary.main }} />}
              >
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="duration">Duration: Shortest First</MenuItem>
                <MenuItem value="departure">Departure: Earliest First</MenuItem>
                <MenuItem value="seats">Available Seats</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter By</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                startAdornment={<FilterList sx={{ mr: 1, color: theme.palette.primary.main }} />}
              >
                <MenuItem value="all">All Buses</MenuItem>
                <MenuItem value="ac">AC Buses</MenuItem>
                <MenuItem value="nonAc">Non-AC Buses</MenuItem>
                <MenuItem value="sleeper">Sleeper</MenuItem>
                <MenuItem value="seater">Seater</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {sortedAndFilteredResults.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          <DirectionsBus sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No buses found matching your criteria
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedAndFilteredResults.map((bus) => (
            <Grid item xs={12} key={bus.id}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: '12px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Stack spacing={1}>
                        <Typography variant="h6" color="primary" fontWeight={600}>
                          {bus.busName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {bus.busType}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {bus.amenities?.map((amenity, index) => {
                            const getAmenityIcon = (name) => {
                              switch (name.toLowerCase()) {
                                case 'ac': return <AcUnit fontSize="small" />;
                                case 'wifi': return <Wifi fontSize="small" />;
                                case 'charging': return <ChargingStation fontSize="small" />;
                                case 'entertainment': return <LiveTv fontSize="small" />;
                                case 'refreshments': return <Restaurant fontSize="small" />;
                                default: return <LocalCafe fontSize="small" />;
                              }
                            };
                            return (
                              <Chip
                                key={index}
                                icon={getAmenityIcon(amenity)}
                                label={amenity}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: '8px' }}
                              />
                            );
                          })}
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Stack spacing={2} alignItems="center">
                        <Box textAlign="center">
                          <Typography variant="h6" color="primary">
                            {formatTime(bus.departureTime)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {bus.source}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime color="action" sx={{ fontSize: 16, mr: 1 }} />
                          <Typography variant="body2" color="textSecondary">
                            {calculateDuration(bus.departureTime, bus.arrivalTime)}
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h6" color="primary">
                            {formatTime(bus.arrivalTime)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {bus.destination}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Stack spacing={1} alignItems="center" justifyContent="center" height="100%">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventSeat color="primary" />
                          <Typography variant="body1">
                            {bus.availableSeats} Seats Available
                          </Typography>
                        </Box>
                        <Rating 
                          value={bus.rating || 4.5} 
                          precision={0.5} 
                          readOnly 
                          size="small"
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Stack spacing={2} alignItems="center" justifyContent="center" height="100%">
                        <Typography variant="h5" color="primary" fontWeight={600}>
                          ₹{bus.fareDetails?.baseFare}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleExpandClick(bus.id)}
                          endIcon={expandedId === bus.id ? <ExpandLess /> : <ExpandMore />}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            '&:hover': {
                              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Collapse in={expandedId === bus.id}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          Boarding Points
                        </Typography>
                        {bus.boardingPoints?.map((point, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'start', mb: 1 }}>
                            <LocationOn color="primary" sx={{ mr: 1, mt: 0.5 }} />
                            <Box>
                              <Typography variant="body1">{point.location}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {point.time}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          Dropping Points
                        </Typography>
                        {bus.droppingPoints?.map((point, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'start', mb: 1 }}>
                            <LocationOn color="primary" sx={{ mr: 1, mt: 0.5 }} />
                            <Box>
                              <Typography variant="body1">{point.location}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {point.time}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{
                            mt: 2,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            '&:hover': {
                              boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          Book Now
                        </Button>
                      </Grid>
                    </Grid>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchResults;
