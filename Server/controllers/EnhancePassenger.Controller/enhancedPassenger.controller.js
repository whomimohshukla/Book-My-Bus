const EnhancedPassenger = require('../../models/EnhancePassanger.Model/enhance.Model');
const mongoose = require('mongoose');

// Create new enhanced passenger profile
exports.createProfile = async (req, res) => {
    try {
        const newProfile = new EnhancedPassenger(req.body);
        const savedProfile = await newProfile.save();
        res.status(201).json({
            success: true,
            data: savedProfile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get passenger profile by ID
exports.getProfile = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id })
            .populate('preferences.frequentRoutes.routeId')
            .populate('loyaltyProgram.history.routeId')
            .populate('loyaltyProgram.history.bookingId');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update passenger profile
exports.updateProfile = async (req, res) => {
    try {
        const updatedProfile = await EnhancedPassenger.findOneAndUpdate(
            { passengerId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        res.json({
            success: true,
            data: updatedProfile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Saved Travelers Management
exports.addSavedTraveler = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        profile.savedTravelers.push(req.body);
        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.savedTravelers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateSavedTraveler = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        const travelerIndex = profile.savedTravelers.findIndex(
            traveler => traveler._id.toString() === req.params.travelerId
        );

        if (travelerIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Saved traveler not found'
            });
        }

        profile.savedTravelers[travelerIndex] = {
            ...profile.savedTravelers[travelerIndex].toObject(),
            ...req.body
        };

        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.savedTravelers[travelerIndex]
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteSavedTraveler = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        profile.savedTravelers = profile.savedTravelers.filter(
            traveler => traveler._id.toString() !== req.params.travelerId
        );

        await profile.save();

        res.json({
            success: true,
            message: 'Saved traveler deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Loyalty Program Management
exports.updateLoyaltyPoints = async (req, res) => {
    try {
        const { points, action, routeId, bookingId } = req.body;
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        // Update points
        profile.loyaltyProgram.points += points;
        
        // Add to history
        profile.loyaltyProgram.history.push({
            action,
            points,
            routeId,
            bookingId,
            date: new Date()
        });

        // Update tier based on total points
        if (profile.loyaltyProgram.points >= 10000) {
            profile.loyaltyProgram.tier = 'Platinum';
        } else if (profile.loyaltyProgram.points >= 5000) {
            profile.loyaltyProgram.tier = 'Gold';
        } else if (profile.loyaltyProgram.points >= 2000) {
            profile.loyaltyProgram.tier = 'Silver';
        }

        // Set tier expiry to 1 year from now
        profile.loyaltyProgram.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.loyaltyProgram
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Preferences Management
exports.updatePreferences = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }
        
        profile.preferences = {
            ...profile.preferences,
            ...req.body
        };
        
        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.preferences
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Frequent Routes Management
exports.addFrequentRoute = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        const existingRouteIndex = profile.preferences.frequentRoutes.findIndex(
            route => route.routeId.toString() === req.body.routeId
        );

        if (existingRouteIndex !== -1) {
            // Update existing route
            profile.preferences.frequentRoutes[existingRouteIndex].frequency += 1;
            profile.preferences.frequentRoutes[existingRouteIndex].lastTraveled = new Date();
            if (req.body.preferredTiming) {
                profile.preferences.frequentRoutes[existingRouteIndex].preferredTiming = req.body.preferredTiming;
            }
        } else {
            // Add new route
            profile.preferences.frequentRoutes.push({
                routeId: req.body.routeId,
                frequency: 1,
                lastTraveled: new Date(),
                preferredTiming: req.body.preferredTiming
            });
        }

        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.preferences.frequentRoutes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Emergency Contact Management
exports.updateEmergencyContact = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        profile.emergencyContact = {
            ...profile.emergencyContact,
            ...req.body
        };

        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.emergencyContact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Analytics and Statistics
exports.getPassengerStats = async (req, res) => {
    try {
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        const stats = {
            totalTrips: profile.loyaltyProgram.totalTrips,
            totalDistance: profile.loyaltyProgram.totalDistance,
            currentTier: profile.loyaltyProgram.tier,
            pointsToNextTier: profile.pointsToNextTier(),
            tierStatus: profile.tierStatus,
            mostFrequentRoutes: profile.preferences.frequentRoutes
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 5),
            savedTravelersCount: profile.savedTravelers.length,
            loyaltyPoints: profile.loyaltyProgram.points
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Bulk operations
exports.bulkUpdateTravelersVerification = async (req, res) => {
    try {
        const { travelerIds, isVerified } = req.body;
        const profile = await EnhancedPassenger.findOne({ passengerId: req.params.id });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Passenger profile not found'
            });
        }

        profile.savedTravelers.forEach(traveler => {
            if (travelerIds.includes(traveler._id.toString())) {
                traveler.isVerified = isVerified;
            }
        });

        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.savedTravelers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
