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
  Table,
  TableBody,
  TableCell,
  TableRow,
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
  Person,
  Phone,
  DriveEta,
} from '@mui/icons-material';

const SearchResults = ({ results }) => {
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
          return bus.busId?.type === 'AC';
        case 'nonAc':
          return bus.busId?.type !== 'AC';
        case 'sleeper':
          return bus.busId?.type?.toLowerCase().includes('sleeper');
        case 'seater':
          return bus.busId?.type?.toLowerCase().includes('seater');
        default:
          return true;
      }
    });
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
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
      return 'Duration N/A';
    }
  };

  const calculateTotalFare = (fareDetails) => {
    if (!fareDetails) return 'N/A';
    const { baseFare = 0, tax = 0, serviceFee = 0 } = fareDetails;
    return baseFare + tax + serviceFee;
  };

  const processedResults = sortResults(filterResults(results));

  if (!results || results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <DirectionsBus sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No buses found for this route
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try different dates or destinations
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            startAdornment={<Sort sx={{ mr: 1 }} />}
          >
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="duration">Duration</MenuItem>
            <MenuItem value="departure">Departure</MenuItem>
            <MenuItem value="seats">Available Seats</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterBy}
            label="Filter"
            onChange={(e) => setFilterBy(e.target.value)}
            startAdornment={<FilterList sx={{ mr: 1 }} />}
          >
            <MenuItem value="all">All Buses</MenuItem>
            <MenuItem value="ac">AC</MenuItem>
            <MenuItem value="nonAc">Non-AC</MenuItem>
            <MenuItem value="sleeper">Sleeper</MenuItem>
            <MenuItem value="seater">Seater</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary">
          {processedResults.length} buses found
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {processedResults.map((bus, index) => (
          <Grid item xs={12} key={bus._id || index}>
            <Card 
              sx={{ 
                '&:hover': { 
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6" component="div">
                      {bus.busId?.busName || 'Bus Name N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bus.busId?.type || 'Type N/A'} • {bus.busId?.busNumber || 'Number N/A'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {bus.routeId?.source?.name} → {bus.routeId?.destination?.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        {formatTime(bus.departureTime)} - {formatTime(bus.arrivalTime)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {calculateDuration(bus.departureTime, bus.arrivalTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distance: {bus.routeId?.distance || 'N/A'} km
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventSeat sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        {bus.availableSeats}/{bus.busId?.totalSeats} seats
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {bus.busId?.amenities?.map((amenity, i) => (
                        <Chip 
                          key={i} 
                          label={amenity.name} 
                          size="small" 
                          variant="outlined"
                          title={amenity.description}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" color="primary">
                      ₹{calculateTotalFare(bus.fareDetails)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Base Fare: ₹{bus.fareDetails?.baseFare}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      +Tax: ₹{bus.fareDetails?.tax}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      color="primary"
                      onClick={() => {/* Handle booking */}}
                    >
                      Book Now
                    </Button>
                    <IconButton
                      onClick={() => handleExpandClick(index)}
                      sx={{ mt: 1, width: '100%' }}
                    >
                      {expandedId === index ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Grid>
                </Grid>

                <Collapse in={expandedId === index}>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Route Details
                      </Typography>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">Source</TableCell>
                            <TableCell>
                              {bus.routeId?.source?.name}, {bus.routeId?.source?.state}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Destination</TableCell>
                            <TableCell>
                              {bus.routeId?.destination?.name}, {bus.routeId?.destination?.state}
                            </TableCell>
                          </TableRow>
                          {bus.routeId?.viaStops?.map((stop, i) => (
                            <TableRow key={i}>
                              <TableCell component="th" scope="row">Via Stop {i + 1}</TableCell>
                              <TableCell>
                                {stop.name} ({stop.arrivalTime} - {stop.departureTime})
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Driver Details
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          {bus.driverDetails?.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          {bus.driverDetails?.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DriveEta sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          License: {bus.driverDetails?.license}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Seat Layout
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {bus.busId?.seatLayout?.seats?.map((seat, i) => (
                          <Chip 
                            key={i}
                            label={`${seat.seatNumber} - ${seat.type}`}
                            size="small"
                            color={seat.isAvailable ? "primary" : "default"}
                            variant={seat.isAvailable ? "outlined" : "filled"}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResults;
