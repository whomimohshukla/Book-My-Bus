const Operator = require("../../models/Operator.model/operator.model");

// create a new Operator

exports.createOperator = async (req, res) => {
	try {
		const { name, contact, address, email } = req.body;

		// Validation
		if (!name || !contact || !address || !email) {
			return res.status(400).json({
				error: "All Filds are required ( eg. name,email,contact,address )",
			});
		}
		// check the operator entry in db
		const existingOperator = await Operator.findOne({ email });
		if (existingOperator) {
			return res.status(400).json({
				error: "An operator with the same email already exists.",
			});
		}
		// create a new Operator
		const operator = await Operator.create({
			name,
			contact,
			address,
			email,
		});

		res.status(201).json({
			message: "Operator created successfully",
			data: operator,
		});
		// console.log("Operator created successfully", operator);
	} catch (error) {
		console.error("Error creating operator:", error);
		res.status(500).json({ error: "Failed to create operator." });
	}
};

// Get all operators
exports.getAllOperators = async (req, res) => {
	try {
		const operators = await Operator.find();
		res.status(200).json({
			message: "Operators fetched successfully",
			data: operators,
		});
	} catch (error) {
		console.error("Error fetching operators:", error);
		res.status(500).json({ error: "Failed to fetch operators." });
	}
};

// Get a single operator by ID
exports.getOperatorById = async (req, res) => {
	try {
		const { id } = req.params;
		const operator = await Operator.findById(id);

		if (!operator) {
			return res.status(404).json({ error: "Operator not found." });
		}

		res.status(200).json({
			message: "Operator fetched successfully",
			data: operator,
		});
	} catch (error) {
		console.error("Error fetching operator:", error);
		res.status(500).json({ error: "Failed to fetch operator." });
	}
};

// Update an operator
exports.updateOperator = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, contact, address, email } = req.body;
		// Validation

		if (!name || !contact || !address || !email) {
			return res.status(400).json({
				error: "All fields are required ( eg. name,email,contact,address )",
			});
		}

		const operator = await Operator.findByIdAndUpdate(
			id,
			{ name, contact, address, email, updatedAt: Date.now() },
			{ new: true, runValidators: true }
		);

		if (!operator) {
			return res.status(404).json({ error: "Operator not found." });
		}

		res.status(200).json({
			message: "Operator updated successfully",
			data: operator,
		});
	} catch (error) {
		console.error("Error updating operator:", error);
		res.status(500).json({ error: "Failed to update operator." });
	}
};

// Delete an operator
exports.deleteOperator = async (req, res) => {
	try {
		const { id } = req.params;

		const operator = await Operator.findByIdAndDelete(id);

		if (!operator) {
			return res.status(404).json({ error: "Operator not found." });
		}

		res.status(200).json({ message: "Operator deleted successfully." });
	} catch (error) {
		console.error("Error deleting operator:", error);
		res.status(500).json({ error: "Failed to delete operator." });
	}
};
