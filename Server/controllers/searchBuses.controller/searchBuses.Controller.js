const Schedule = require("../../models/Schedule.model/schedule.model");
const Route = require("../../models/TravelRoute.model/travelRoute.model");

exports.searchBuses = async (req, res) => {
  try {
    const { source, destination, date, time } = req.query;
    
    console.log("Received query params:", { source, destination, date, time });

    // Validate required fields
    if (!source || !destination || !date) {
      return res
        .status(400)
        .json({ error: "Source, destination, and date are required." });
    }

    // Find the matching route(s)
    const routeQuery = {
      "source.name": new RegExp(source, "i"),
      "destination.name": new RegExp(destination, "i"),
    };
    
    console.log("Route query:", routeQuery);
    
    const routes = await Route.find(routeQuery);
    console.log("Found routes:", routes);

    if (!routes || routes.length === 0) {
      return res.status(404).json({
        message: "No routes found for the given source and destination.",
      });
    }

    // Extract route IDs
    const routeIds = routes.map((route) => route._id);
    console.log("Route IDs:", routeIds);

    // Parse the input date
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Build the query for buses
    const query = {
      routeId: { $in: routeIds },
      departureTime: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: "Active" // Only show active schedules
    };

    if (time) {
      // If time is provided, search within a 2-hour window of the specified time
      const [hours, minutes] = time.split(":");
      const searchTime = new Date(searchDate);
      searchTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const timeWindowStart = new Date(searchTime);
      timeWindowStart.setHours(timeWindowStart.getHours() - 1);
      
      const timeWindowEnd = new Date(searchTime);
      timeWindowEnd.setHours(timeWindowEnd.getHours() + 1);

      query.departureTime = {
        $gte: timeWindowStart,
        $lte: timeWindowEnd
      };
    }

    console.log("Schedule query:", JSON.stringify(query, null, 2));

    // Query buses with populated route and bus data
    const buses = await Schedule.find(query)
      .populate({
        path: 'routeId',
        select: 'source destination distance duration'
      })
      .populate({
        path: 'busId',
        select: 'busNumber type totalSeats name busName operator amenities'
      })
      .lean();
    
    console.log("Found buses:", buses);

    if (!buses || buses.length === 0) {
      return res
        .status(404)
        .json({ message: "No buses found for the given criteria." });
    }

    // Transform the response to include formatted dates and times
    const formattedBuses = buses.map(bus => ({
      ...bus,
      departureTime: bus.departureTime.toISOString(),
      arrivalTime: bus.arrivalTime.toISOString(),
      formattedDepartureTime: new Date(bus.departureTime).toLocaleString(),
      formattedArrivalTime: new Date(bus.arrivalTime).toLocaleString(),
      busName: bus.busId?.busName || bus.busId?.name || `Bus ${bus.busId?.busNumber}` || 'N/A'
    }));

    res.status(200).json(formattedBuses);
  } catch (error) {
    console.error("Error searching for buses:", error);
    res.status(500).json({ 
      error: "An error occurred while searching for buses",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
