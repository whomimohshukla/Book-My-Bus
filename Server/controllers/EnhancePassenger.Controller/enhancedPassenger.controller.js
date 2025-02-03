const EnhancedPassenger = require("../../models/EnhancePassanger.Model/enhance.Model");
const mongoose = require("mongoose");

// Create new enhanced passenger profile
exports.createProfile = async (req, res) => {
    try {
        // Get userId from auth token
        const userId = req.user._id; // This comes from the auth middleware

        // Check if profile already exists
        const existingProfile = await EnhancedPassenger.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Profile already exists for this user'
            });
        }

        // Create new profile with userId from auth token
        const newProfile = new EnhancedPassenger({
            userId,
            ...req.body
        });

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

// Get passenger profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await EnhancedPassenger.findOne({ userId })
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
        const userId = req.user._id;
        const updatedProfile = await EnhancedPassenger.findOneAndUpdate(
            { userId },
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

// Add saved traveler
exports.addSavedTraveler = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await EnhancedPassenger.findOne({ userId });
        
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

// Update saved traveler
exports.updateSavedTraveler = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await EnhancedPassenger.findOne({ userId });
        
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

// Delete saved traveler
exports.deleteSavedTraveler = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await EnhancedPassenger.findOne({ userId });
        
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

// Update loyalty points
exports.updateLoyaltyPoints = async (req, res) => {
    try {
        const userId = req.user._id;
        const { points, action, routeId, bookingId } = req.body;
        const profile = await EnhancedPassenger.findOne({ userId });

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

// Get passenger stats
exports.getPassengerStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await EnhancedPassenger.findOne({ userId });
        
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
