const mongoose = require('mongoose');
const Route = require('../models/TravelRoute.model/travelRoute.model');

const addTestViaStops = async () => {
  try {
    // Find all routes
    const routes = await Route.find({});
    
    for (const route of routes) {
      // Add some test via stops between source and destination
      const viaStops = [
        {
          name: 'Midpoint Stop 1',
          arrivalTime: '10:00',
          departureTime: '10:15',
          stopDuration: 15
        },
        {
          name: 'Midpoint Stop 2',
          arrivalTime: '11:30',
          departureTime: '11:45',
          stopDuration: 15
        }
      ];

      route.viaStops = viaStops;
      await route.save();
      console.log(`Added via stops to route: ${route._id}`);
    }

    console.log('Successfully added test via stops to all routes');
    process.exit(0);
  } catch (error) {
    console.error('Error adding test via stops:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/bookmybus')
  .then(() => {
    console.log('Connected to MongoDB');
    addTestViaStops();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
