const Route = require("../../models/TravelRoute.model/travelRoute.model");
const City = require("../../models/City.model/city.model"); // Assuming you have a City model to validate cityIds

exports.createRoute = async (req, res) => {
  try {
    const { source, destination, distance, pricePerKm, viaStops } = req.body;

    // Validate input
    if (!source?.name || !destination?.name || !distance || !pricePerKm) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Fetch source city by name
    const sourceCity = await City.findOne({ name: source.name });
    if (!sourceCity) {
      return res
        .status(404)
        .json({ message: `Source city ${source.name} not found.` });
    }

    // Fetch destination city by name
    const destinationCity = await City.findOne({ name: destination.name });
    if (!destinationCity) {
      return res
        .status(404)
        .json({ message: `Destination city ${destination.name} not found.` });
    }

    // check the same entry of source and destination
    if (sourceCity._id === destinationCity._id) {
      return res
        .status(400)
        .json({ message: "Source and destination cannot be the same." });
    }

    // Process viaStops if provided
    let processedViaStops = [];
    if (viaStops && viaStops.length > 0) {
      for (const stop of viaStops) {
        const city = await City.findOne({ name: stop.name });
        if (!city) {
          return res
            .status(404)
            .json({ message: `Via stop city ${stop.name} not found.` });
        }
        processedViaStops.push({
          cityId: city._id,
          name: city.name,
          arrivalTime: stop.arrivalTime,
          departureTime: stop.departureTime,
          stopDuration: stop.stopDuration,
        });
      }
    }

    // Create a new route
    const newRoute = new Route({
      source: {
        cityId: sourceCity._id,
        name: sourceCity.name,
        state: sourceCity.state,
        location: sourceCity.location,
      },
      destination: {
        cityId: destinationCity._id,
        name: destinationCity.name,
        state: destinationCity.state,
        location: destinationCity.location,
      },
      distance,
      pricePerKm,
      viaStops: processedViaStops,
    });

    await newRoute.save();

    res
      .status(201)
      .json({ message: "Route created successfully.", route: newRoute });
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("source.cityId")
      .populate("destination.cityId")
      .populate("viaStops.cityId"); // Populating cities related to the route
    res.status(200).json({ routes });
  } catch (error) {
    console.error("Error fetching routes:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single route by ID
exports.getRouteById = async (req, res) => {
  try {
    const routeId = req.params.id;

    const route = await Route.findById(routeId)
      .populate("source.cityId")
      .populate("destination.cityId")
      .populate("viaStops.cityId");

    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    res.status(200).json({ route });
  } catch (error) {
    console.error("Error fetching route:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a route
exports.updateRoute = async (req, res) => {
  try {
    const routeId = req.params.id;
    const { source, destination, distance, pricePerKm, viaStops } = req.body;

    // Check if route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    // Optionally validate if the source/destination city IDs exist
    const sourceCity = await City.findById(source.cityId);
    const destinationCity = await City.findById(destination.cityId);

    if (!sourceCity || !destinationCity) {
      return res
        .status(400)
        .json({ message: "Invalid source or destination city." });
    }

    // Update the route
    route.source = source;
    route.destination = destination;
    route.distance = distance;
    route.pricePerKm = pricePerKm;
    route.viaStops = viaStops;

    await route.save();

    res.status(200).json({ message: "Route updated successfully.", route });
  } catch (error) {
    console.error("Error updating route:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a route
exports.deleteRoute = async (req, res) => {
  try {
    const routeId = req.params.id;

    const route = await Route.findByIdAndDelete(routeId);

    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    res.status(200).json({ message: "Route deleted successfully." });
  } catch (error) {
    console.error("Error deleting route:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// add bus stops in route
exports.addBusStopsToRoute = async (req, res) => {
  try {
    const routeId = req.params.id;
    const { busStops } = req.body;

    // Check if route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    // Add bus stops to the route
    route.busStops = busStops;

    await route.save();

    res
      .status(200)
      .json({ message: "Bus stops added to route successfully.", route });
  } catch (error) {
    console.error("Error adding bus stops to route:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
