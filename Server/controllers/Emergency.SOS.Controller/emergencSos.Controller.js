const EmergencyContact = require("../../models/Emergency.Model/emergency.model");
const SOSAlert = require("../../models/SOSAlert.Model/sosAlertSchems");
const {
  sendSMS,
  sendEmail,
} = require("../../utls/notification/notificationService"); // You'll need to implement this
const {
  findNearbyHospitals,
} = require("../../utls/notification/locationService"); // You'll need to implement this

// SOS Alert Controller
// controllers/emergencyController.js

exports.triggerSOS = async (req, res) => {
  try {
    const { userId, location, description, emergencyType } = req.body;

    // Create new SOS alert
    const sosAlert = await SOSAlert.create({
      userId,
      // busId,
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
          //   // Send SMS notification
          //   await sendSMS(
          //     contact.phoneNumber,
          //     `EMERGENCY ALERT: Contact requiring immediate assistance. Location: ${location.latitude}, ${location.longitude}. Type: ${emergencyType}. View map: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
          //   );

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

    // Find nearby hospitals
    const hospitals = await findNearbyHospitals(
      location.latitude,
      location.longitude
    );

    res.status(200).json({
      success: true,
      data: {
        sosAlert,
        hospitals,
      },
    });
  } catch (error) {
    console.error("SOS Alert Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to trigger SOS alert",
      error: error.message,
    });
  }
};
// Emergency Contacts Controllers
exports.getEmergencyContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const contacts = await EmergencyContact.findOne({ userId });

    if (!contacts) {
      return res.status(404).json({
        success: false,
        message: "No emergency contacts found",
      });
    }

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emergency contacts",
      error: error.message,
    });
  }
};

// to add

exports.updateEmergencyContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { contact } = req.body;

    // Validate contact information
    if (
      !contact ||
      !contact.name ||
      !contact.relationship ||
      !contact.phoneNumber ||
      !contact.email
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact information",
      });
    }

    // Create or update emergency contact
    const updatedContacts = await EmergencyContact.findOneAndUpdate(
      { userId },
      {
        $push: {
          contacts: contact,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: updatedContacts,
      message: "Contacts updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add emergency contact",
      error: error.message,
    });
  }
};

exports.createOrUpdateEmergencyContacts = async (req, res) => {
  try {
    const { userId, contacts } = req.body;

    if (!userId || !Array.isArray(contacts)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. 'userId' and 'contacts' are required.",
      });
    }

    // Validate each contact
    contacts.forEach((contact) => {
      if (!contact.name || !contact.relationship || !contact.phoneNumber) {
        throw new Error(
          "Each contact must have a name, relationship, and phone number."
        );
      }
    });

    const updatedContacts = await EmergencyContact.findOneAndUpdate(
      { userId },
      { contacts },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: updatedContacts,
      message: "Emergency contacts updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update emergency contacts.",
      error: error.message,
    });
  }
};

// Nearby Hospitals Controller
// controllers/emergencyController.js
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
    const rad = parseFloat(radius);

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    if (rad <= 0 || rad > 50000) {
      return res.status(400).json({
        success: false,
        message: "Radius must be between 1 and 50000 meters",
      });
    }

    // console.log("Searching for hospitals:", {
    //   latitude: lat,
    //   longitude: lon,
    //   radius: rad,
    // });

    const hospitals = await findNearbyHospitals(lat, lon, rad);
    // console.log(hospitals)
    return res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
      metadata: {
        searchLocation: { latitude: lat, longitude: lon },
        searchRadius: rad,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in getNearbyHospitals:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching nearby hospitals",
    });
  }
};

// Helper function to validate phone numbers
// const validatePhoneNumber = (phoneNumber) => {
//   // Implement phone number validation logic
//   const phoneRegex = /^\+?[\d\s-]{10,}$/;
//   return phoneRegex.test(phoneNumber);
// };

// Helper function to validate email
const validateEmail = (email) => {
  // Implement email validation logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
