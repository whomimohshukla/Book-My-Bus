const EnhancedPassenger = require("../../models/EnhancePassanger.Model/enhance.Model");
const mongoose = require("mongoose");

// Create new enhanced passenger profile
exports.createProfile = async (req, res) => {
  try {
    // Get userId from auth token
    const userId = req.user._id;

    // Try to find existing profile first
    let profile = await EnhancedPassenger.findOne({ userId });
    
    if (profile) {
      // If profile exists, update it
      Object.assign(profile, req.body);
      profile = await profile.save();
    } else {
      // Create new profile
      profile = new EnhancedPassenger({
        userId,
        ...req.body
      });
      profile = await profile.save();
    }

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    // Check if it's a duplicate key error
    if (error.code === 11000) {
      // Try to delete the existing document and create a new one
      try {
        await EnhancedPassenger.deleteOne({ userId: req.user._id });
        const newProfile = new EnhancedPassenger({
          userId: req.user._id,
          ...req.body
        });
        const savedProfile = await newProfile.save();
        
        return res.status(201).json({
          success: true,
          data: savedProfile
        });
      } catch (retryError) {
        return res.status(500).json({
          success: false,
          message: "Failed to create profile after retry"
        });
      }
    }
    
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

// Add frequent route
exports.addFrequentRoute = async (req, res) => {
    try {
        const userId = req.user._id;
        const { routeId, preferredTiming } = req.body;
        const profile = await EnhancedPassenger.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Passenger profile not found",
            });
        }

        // Check if route already exists
        const existingRoute = profile.preferences.frequentRoutes.find(
            (route) => route.routeId.toString() === routeId
        );

        if (existingRoute) {
            existingRoute.frequency += 1;
            existingRoute.lastTraveled = new Date();
            if (preferredTiming) {
                existingRoute.preferredTiming = preferredTiming;
            }
        } else {
            profile.preferences.frequentRoutes.push({
                routeId,
                frequency: 1,
                lastTraveled: new Date(),
                preferredTiming,
            });
        }

        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.preferences.frequentRoutes,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get frequent routes
exports.getFrequentRoutes = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await EnhancedPassenger.findOne({ userId }).populate(
            "preferences.frequentRoutes.routeId"
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Passenger profile not found",
            });
        }

        // Sort routes by frequency
        const sortedRoutes = profile.preferences.frequentRoutes.sort(
            (a, b) => b.frequency - a.frequency
        );

        res.json({
            success: true,
            data: sortedRoutes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update frequent route
exports.updateFrequentRoute = async (req, res) => {
    try {
        const userId = req.user._id;
        const { routeId } = req.params;
        const { preferredTiming } = req.body;
        const profile = await EnhancedPassenger.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Passenger profile not found",
            });
        }

        const routeIndex = profile.preferences.frequentRoutes.findIndex(
            (route) => route.routeId.toString() === routeId
        );

        if (routeIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Frequent route not found",
            });
        }

        profile.preferences.frequentRoutes[routeIndex] = {
            ...profile.preferences.frequentRoutes[routeIndex].toObject(),
            preferredTiming,
            lastTraveled: new Date(),
        };

        const updatedProfile = await profile.save();

        res.json({
            success: true,
            data: updatedProfile.preferences.frequentRoutes[routeIndex],
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete frequent route
exports.deleteFrequentRoute = async (req, res) => {
    try {
        const userId = req.user._id;
        const { routeId } = req.params;
        const profile = await EnhancedPassenger.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Passenger profile not found",
            });
        }

        profile.preferences.frequentRoutes = profile.preferences.frequentRoutes.filter(
            (route) => route.routeId.toString() !== routeId
        );

        await profile.save();

        res.json({
            success: true,
            message: "Frequent route deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Analyze and update frequent routes after booking
exports.analyzeAndUpdateFrequentRoutes = async (userId, routeId, bookingTime) => {
    try {
        const profile = await EnhancedPassenger.findOne({ userId });
        if (!profile) return;

        // Find or create route in frequent routes
        let route = profile.preferences.frequentRoutes.find(
            route => route.routeId.toString() === routeId
        );

        if (route) {
            // Update existing route
            route.frequency += 1;
            route.lastTraveled = new Date();
            
            // Analyze preferred timing pattern
            const hour = new Date(bookingTime).getHours();
            if (hour >= 4 && hour < 12) route.preferredTiming = 'morning';
            else if (hour >= 12 && hour < 17) route.preferredTiming = 'afternoon';
            else if (hour >= 17 && hour < 22) route.preferredTiming = 'evening';
            else route.preferredTiming = 'night';
            
        } else {
            // Add new route
            profile.preferences.frequentRoutes.push({
                routeId,
                frequency: 1,
                lastTraveled: new Date(),
                preferredTiming: getTimeOfDay(bookingTime)
            });
        }

        await profile.save();
        return profile.preferences.frequentRoutes;
    } catch (error) {
        console.error('Error analyzing frequent routes:', error);
    }
};

// Get route recommendations based on travel history
exports.getRouteRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await EnhancedPassenger.findOne({ userId })
            .populate('preferences.frequentRoutes.routeId');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Get current day and time
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentHour = now.getHours();

        // Analyze patterns and create recommendations
        const recommendations = profile.preferences.frequentRoutes
            .map(route => {
                const score = calculateRecommendationScore(route, dayOfWeek, currentHour);
                return { route, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(({ route }) => ({
                routeId: route.routeId,
                frequency: route.frequency,
                preferredTiming: route.preferredTiming,
                lastTraveled: route.lastTraveled,
                recommendation: getRecommendationType(route)
            }));

        res.json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to calculate recommendation score
function calculateRecommendationScore(route, currentDay, currentHour) {
    let score = route.frequency * 10; // Base score from frequency

    // Recency factor
    const daysSinceLastTravel = Math.floor((new Date() - new Date(route.lastTraveled)) / (1000 * 60 * 60 * 24));
    score += Math.max(0, 30 - daysSinceLastTravel); // More recent = higher score

    // Time preference match
    if (route.preferredTiming === getTimeOfDay(new Date().setHours(currentHour))) {
        score += 20;
    }

    return score;
}

// Helper function to get time of day
function getTimeOfDay(datetime) {
    const hour = new Date(datetime).getHours();
    if (hour >= 4 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
}

// Helper function to get recommendation type
function getRecommendationType(route) {
    const daysSinceLastTravel = Math.floor((new Date() - new Date(route.lastTraveled)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastTravel <= 7) return 'Recent Route';
    if (route.frequency >= 5) return 'Popular Route';
    return 'Previously Traveled';
}
