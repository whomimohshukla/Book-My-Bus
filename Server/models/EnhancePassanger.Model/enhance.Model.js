const mongoose = require('mongoose');

const frequentRouteSchema = new mongoose.Schema({
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    frequency: { type: Number, default: 1 },
    lastTraveled: { type: Date },
    preferredTiming: { type: String } // To store preferred travel time for this route
});

const savedTravelerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    idType: { type: String, enum: ['Aadhar', 'PAN', 'Passport', 'Driving License'], required: true },
    idNumber: { type: String, required: true },
    relationship: { type: String, required: true },
    dateOfBirth: { type: Date },
    contactNumber: { type: String },
    isVerified: { type: Boolean, default: false }
});

const loyaltyHistorySchema = new mongoose.Schema({
    action: { type: String, required: true },
    points: { type: Number, required: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' }, // Reference to the route if points are from travel
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, // Reference to booking if points are from booking
    date: { type: Date, default: Date.now }
});

const enhancedPassengerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true }, // Making userId unique as one user = one passenger profile
    preferences: {
        seatPreference: { type: String, enum: ['Window', 'Aisle', 'Middle', 'No Preference'], default: 'No Preference' },
        mealPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Jain', 'None'], default: 'None' },
        specialAssistance: { type: Boolean, default: false },
        specialAssistanceDetails: { type: String }, // Details about required assistance
        notificationPreferences: {
            sms: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            whatsapp: { type: Boolean, default: false }
        },
        languagePreference: { type: String, default: 'English' },
        frequentRoutes: [frequentRouteSchema]
    },
    savedTravelers: [savedTravelerSchema],
    loyaltyProgram: {
        points: { type: Number, default: 0 },
        tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
        joinDate: { type: Date, default: Date.now },
        history: [loyaltyHistorySchema],
        expiryDate: { type: Date }, // When current tier benefits expire
        totalTrips: { type: Number, default: 0 },
        totalDistance: { type: Number, default: 0 } // Total distance traveled in km
    },
    emergencyContact: {
        name: { type: String },
        relationship: { type: String },
        phoneNumber: { type: String }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
enhancedPassengerSchema.index({ userId: 1 }, { unique: true });
enhancedPassengerSchema.index({ 'loyaltyProgram.tier': 1 });
enhancedPassengerSchema.index({ 'savedTravelers.idNumber': 1 });
enhancedPassengerSchema.index({ 'preferences.frequentRoutes.routeId': 1 });

// Virtual for calculating tier expiry
enhancedPassengerSchema.virtual('tierStatus').get(function() {
    if (!this.loyaltyProgram.expiryDate) return 'Active';
    return Date.now() < this.loyaltyProgram.expiryDate ? 'Active' : 'Expired';
});

// Method to calculate points needed for next tier
enhancedPassengerSchema.methods.pointsToNextTier = function() {
    const currentPoints = this.loyaltyProgram.points;
    if (currentPoints >= 10000) return 0; // Already at Platinum
    if (currentPoints >= 5000) return 10000 - currentPoints; // Points needed for Platinum
    if (currentPoints >= 2000) return 5000 - currentPoints; // Points needed for Gold
    return 2000 - currentPoints; // Points needed for Silver
};

const EnhancedPassenger = mongoose.model('EnhancedPassenger', enhancedPassengerSchema);

module.exports = EnhancedPassenger;