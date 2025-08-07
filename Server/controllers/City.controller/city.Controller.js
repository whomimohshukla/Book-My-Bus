const City = require("../../models/City.model/city.model");
const axios = require("axios");

// Create a new city
// Create a new city
exports.createCity = async (req, res) => {
	try {
		const { name, state, isPopular } = req.body;

		// Validate essential fields
		if (!name || !state) {
			return res.status(400).json({
				error: "Both 'name' and 'state' fields are required.",
			});
		}

		// Check the database for duplicate entries
		const existingCity = await City.findOne({ name, state });
		if (existingCity) {
			return res.status(400).json({
				error: "A city with the same name and state already exists.",
			});
		}

		// Fetch location using OpenCage API
		const apiKey = process.env.OPENCAGE_API; // Your OpenCage API Key
		const query = `${name}, ${state}`;
		const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
			query
		)}&key=${apiKey}`;

		const geoResponse = await axios.get(url);
		if (geoResponse.data.results.length === 0) {
			return res.status(400).json({
				error: "Unable to fetch location for the provided city and state.",
			});
		}

		// Extract latitude and longitude from the API response
		const location = geoResponse.data.results[0].geometry;

		// Create the city
		const city = new City({
			name,
			state,
			location: {
				type: "Point",
				coordinates: [location.lng, location.lat],
			},
			isPopular,
		});

		await city.save();
		res.status(201).json({
			message: "City created successfully",
			data: city,
		});
	} catch (error) {
		if (error.code === 11000) {
			// Handle duplicate key error
			return res.status(400).json({
				error: "A city with the same name already exists.",
			});
		}

		console.error("Error in creating city:", error);
		res.status(500).json({ error: error.message });
	}
};

// Get all cities
exports.getCities = async (req, res) => {
	try {
		const cities = await City.find();
		res.status(200).json(cities);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Suggest cities by partial name (autocomplete)
exports.suggestCities = async (req, res) => {
	try {
		const { q = "" } = req.query;

		// Empty query returns empty list (helps avoid heavy DB hits)
		if (!q.trim()) {
			return res.json([]);
		}

		// Case–insensitive partial match, limit to 10 results
		const regex = new RegExp(q.trim(), "i");
		const cities = await City.find({ name: regex })
			.limit(10)
			.select("name state");

		// Format suggestions
		const suggestions = cities.map((c) => ({
			id: c._id,
			name: c.name,

			label: `${c.name}`,
		}));

		res.json(suggestions);
	} catch (error) {
		console.error("Error getting city suggestions:", error);
		res.status(500).json({ error: error.message });
	}
};

// Get a single city by name
exports.getCityByName = async (req, res) => {
	try {
		const { name } = req.params;

		// Check if the name is provided
		if (!name) {
			return res.status(400).json({ error: "City name is required." });
		}

		// Find city by name (case-insensitive search)
		const city = await City.findOne({ name: new RegExp(`^${name}$`, "i") });

		if (!city) {
			return res.status(404).json({ error: "City not found" });
		}

		res.status(200).json(city);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update a city
// Update a city

exports.updateCity = async (req, res) => {
	try {
		const { id } = req.params;

		// Validate request parameters
		if (!id) {
			return res.status(400).json({ error: "City ID is required." });
		}

		// Validate request body
		const updateData = req.body;
		if (!updateData || Object.keys(updateData).length === 0) {
			return res.status(400).json({ error: "No update data provided." });
		}

		// Find the city by ID and update
		const city = await City.findByIdAndUpdate(id, updateData, {
			new: true, // Return the updated document
			runValidators: true, // Run schema validators on the update
		});

		// If city not found
		if (!city) {
			return res.status(404).json({ error: "City not found" });
		}

		// Successfully updated
		res.status(200).json({
			message: "City updated successfully.",
			data: city,
		});
	} catch (error) {
		// Log error and return response
		console.error("Error updating city:", error);
		res.status(500).json({ error: error.message });
	}
};

// Delete a city
// Delete a city by ID
exports.deleteCityById = async (req, res) => {
	try {
		const { id } = req.params;

		// Validate input
		if (!id) {
			return res.status(400).json({ error: "City ID is required." });
		}

		// Find and delete the city by ID
		const city = await City.findByIdAndDelete(id);

		// If city is not found
		if (!city) {
			return res.status(404).json({ error: "City not found." });
		}

		// Successfully deleted
		res.status(200).json({
			message: "City deleted successfully",
			data: city,
		});
	} catch (error) {
		// Handle unexpected errors
		console.error("Error deleting city by ID:", error);
		res.status(500).json({ error: error.message });
	}
};
