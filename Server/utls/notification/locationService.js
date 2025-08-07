const axios = require("axios");
const Hospital = require("../../models/Emergency.Model/hospitalSchema"); // Assuming the schema includes the fallback hospitals

const findNearbyHospitals = async (latitude, longitude, radius = 5000) => {
  try {
    // console.log(
    //   `Starting hospital search for coordinates (${latitude}, ${longitude}) with radius ${radius} meters.`
    // );

    let hospitals = [];
    try {
      // OpenStreetMap Overpass API query
      const query = `
                [out:json][timeout:25];
                (
                    node[amenity=hospital](around:${radius},${latitude},${longitude});
                    way[amenity=hospital](around:${radius},${latitude},${longitude});
                );
                out body center;
            `;

    //   console.log("Querying OpenStreetMap API...");
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 20000, // Extended timeout
        }
      );

    //   console.log("OSM API Response received:", response.data);

      if (response.data && response.data.elements) {
        hospitals = response.data.elements
          .map((element) => createHospitalObject(element, latitude, longitude))
          .filter(
            (hospital) =>
              hospital !== null && hospital.name !== "Unknown Hospital"
          );

        // console.log(`${hospitals.length} hospitals found via OpenStreetMap.`);
      }
    } catch (osmError) {
      console.error("Error querying OpenStreetMap API:", osmError.message);
    }

    // Use fallback data if no hospitals found
    if (hospitals.length === 0) {
    //   console.log(
    //     "No hospitals found from OpenStreetMap, fetching fallback data from the database."
    //   );

      const fallbackHospitals = await Hospital.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius,
          },
        },
      }).exec();

      hospitals = fallbackHospitals.map((hospital) => ({
        name: hospital.name,
        address: hospital.address,
        location: hospital.location,
        phone: hospital.phone,
        emergency: hospital.emergency,
        type: hospital.type || "hospital",
        source: "Fallback",
        distance: calculateDistance(
          latitude,
          longitude,
          hospital.location.latitude,
          hospital.location.longitude
        ),
      }));
    }

    // Sort hospitals by distance
    hospitals.sort((a, b) => a.distance - b.distance);
    // console.log("Sorted hospitals by distance:", hospitals);

    return hospitals;
  } catch (error) {
    console.error("Error in findNearbyHospitals:", error.message);

    // Fetch fallback data as a backup in case of errors
    const fallbackHospitals = await Hospital.find().exec();
    return fallbackHospitals
      .map((hospital) => ({
        name: hospital.name,
        address: hospital.address,
        location: hospital.location,
        phone: hospital.phone,
        emergency: hospital.emergency,
        type: hospital.type || "hospital",
        source: "Fallback",
        distance: calculateDistance(
          latitude,
          longitude,
          hospital.location.latitude,
          hospital.location.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }
};

const createHospitalObject = (element, searchLat, searchLon) => {
  const lat = element.lat || element.center?.lat;
  const lon = element.lon || element.center?.lon;
  const tags = element.tags || {};

  if (!lat || !lon || !tags) return null;

  const hospital = {
    name: tags.name || tags.operator || "Unknown Hospital",
    address:
      tags["addr:full"] ||
      `${tags["addr:street"] || ""} ${tags["addr:housenumber"] || ""}`.trim() ||
      "Address not available",
    location: { latitude: lat, longitude: lon },
    phone: tags.phone || "N/A",
    emergency: tags.emergency === "yes",
    type: tags.healthcare || "hospital",
    distance: calculateDistance(searchLat, searchLon, lat, lon),
    source: "OpenStreetMap",
  };

//   console.log("Created hospital object:", hospital);
  return hospital;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

const toRad = (value) => (value * Math.PI) / 180;

module.exports = { findNearbyHospitals };
