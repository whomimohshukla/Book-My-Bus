const EmergencyContact = require("../../models/Emergency.Model/emergency.model");
const SOSAlert = require("../../models/SOSAlert.Model/sosAlertSchems");
const {
  sendSMS,
  sendEmail,
} = require("../../utls/notification/notificationService");
const {
  findNearbyHospitals,
} = require("../../utls/notification/locationService");

// Helper function to validate contact information
const validateContact = (contact) => {
  if (!contact.name || contact.name.trim() === '') {
    throw new Error('Name is required');
  }
  if (!contact.phoneNumber || contact.phoneNumber.trim() === '') {
    throw new Error('Phone number is required');
  }
  if (!contact.relationship || contact.relationship.trim() === '') {
    throw new Error('Relationship is required');
  }
  // Email is optional, but if provided should be valid
  if (contact.email && !contact.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Invalid email format');
  }
  // Phone number validation (basic)
  if (!contact.phoneNumber.match(/^\+?[\d\s-]{10,}$/)) {
    throw new Error('Invalid phone number format');
  }
  return true;
};

// SOS Alert Controller
exports.triggerSOS = async (req, res) => {
  try {
    const { userId, location, description, emergencyType } = req.body;

    // Create new SOS alert
    const sosAlert = await SOSAlert.create({
      userId,
      location,
      description,
      emergencyType,
      timestamp: new Date(),
    });

    // Get user's emergency contacts
    const emergencyContacts = await EmergencyContact.findOne({ userId });

    // Notify emergency contacts
    if (emergencyContacts) {
      for (const contact of emergencyContacts.contacts) {
        if (contact.isActive) {
          // Send Enhanced Email notification
          if (contact.email) {
            await sendEmail(contact.email, "Emergency Alert", {
              location,
              emergencyType,
              timestamp: sosAlert.createdAt,
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: sosAlert,
      message: "Emergency alert triggered successfully",
    });
  } catch (error) {
    console.error("Error triggering SOS alert:", error);
    res.status(500).json({
      success: false,
      message: "Failed to trigger emergency alert",
      error: error.message,
    });
  }
};

// Emergency Contacts Controllers
exports.getEmergencyContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    const emergencyContacts = await EmergencyContact.findOne({ userId });

    res.status(200).json({
      success: true,
      data: emergencyContacts || { userId, contacts: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emergency contacts",
      error: error.message,
    });
  }
};

exports.updateEmergencyContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { contacts } = req.body;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({
        success: false,
        message: "Contacts must be an array",
      });
    }

    // Validate all contacts
    contacts.forEach(validateContact);

    // Update contacts
    const updatedContacts = await EmergencyContact.findOneAndUpdate(
      { userId },
      { contacts },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: updatedContacts,
      message: "Contacts updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update contacts",
    });
  }
};

exports.addEmergencyContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const { contact } = req.body;

    // Validate the new contact
    validateContact(contact);

    // Add the new contact
    const result = await EmergencyContact.findOneAndUpdate(
      { userId },
      { $push: { contacts: contact } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: result.contacts[result.contacts.length - 1],
      message: "Contact added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add contact",
    });
  }
};

exports.deleteEmergencyContact = async (req, res) => {
  try {
    const { userId, contactId } = req.params;

    const result = await EmergencyContact.findOneAndUpdate(
      { userId },
      { $pull: { contacts: { _id: contactId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};

// Nearby Hospitals Controller
exports.getNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    const hospitals = await findNearbyHospitals(lat, lon, radius);

    res.status(200).json({
      success: true,
      data: hospitals,
      metadata: {
        searchLocation: { latitude: lat, longitude: lon },
        searchRadius: radius,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby hospitals",
      error: error.message,
    });
  }
};
