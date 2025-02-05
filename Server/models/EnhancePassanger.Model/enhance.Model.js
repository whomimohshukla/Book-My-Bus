const mongoose = require('mongoose');

//this is enhance model
const frequentRouteSchema = new mongoose.Schema({
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    frequency: { type: Number, default: 1 },
    lastTraveled: { type: Date },
    preferredTiming: { type: String }
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
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    date: { type: Date, default: Date.now }
});

const enhancedPassengerSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    },
    preferences: {
        seatPreference: { 
            type: String, 
            enum: ['Window', 'Aisle', 'Middle', 'No Preference'], 
            default: 'No Preference' 
        },
        mealPreference: { 
            type: String, 
            enum: ['Veg', 'Non-Veg', 'Jain', 'None'], 
            default: 'None' 
        },
        specialAssistance: { 
            type: Boolean, 
            default: false 
        },
        notificationPreferences: {
            sms: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            whatsapp: { type: Boolean, default: false }
        },
        languagePreference: { 
            type: String, 
            default: 'English' 
        },
        frequentRoutes: [frequentRouteSchema]
    },
    savedTravelers: [savedTravelerSchema],
    loyaltyProgram: {
        points: { type: Number, default: 0 },
        tier: { 
            type: String, 
            enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], 
            default: 'Bronze' 
        },
        totalTrips: { type: Number, default: 0 },
        totalDistance: { type: Number, default: 0 },
        joinDate: { type: Date, default: Date.now },
        history: [loyaltyHistorySchema]
    }
}, {
    timestamps: true,
    autoIndex: false // Disable auto-indexing
});

// Virtual for tier status
enhancedPassengerSchema.virtual('tierStatus').get(function() {
    const pointsToNextTier = this.pointsToNextTier();
    if (pointsToNextTier === 0) {
        return 'Maximum tier reached';
    }
    return `${pointsToNextTier} points needed for next tier`;
});

// Method to calculate points needed for next tier
enhancedPassengerSchema.methods.pointsToNextTier = function() {
    const currentPoints = this.loyaltyProgram.points;
    if (currentPoints >= 10000) return 0; // Already at maximum tier
    if (currentPoints >= 5000) return 10000 - currentPoints; // Points needed for Platinum
    if (currentPoints >= 2000) return 5000 - currentPoints; // Points needed for Gold
    return 2000 - currentPoints; // Points needed for Silver
};

// Drop existing collection and recreate with new schema
mongoose.connection.on('connected', async () => {
    try {
        // Drop existing collection if it exists
        if (mongoose.connection.collections['enhancedpassengers']) {
            await mongoose.connection.collections['enhancedpassengers'].drop();
        }
        
        // Create new indexes
        await enhancedPassengerSchema.index({ userId: 1 }, { unique: true });
        await enhancedPassengerSchema.index({ 'loyaltyProgram.tier': 1 });
        await enhancedPassengerSchema.index({ 'savedTravelers.idNumber': 1 });
        
        console.log('Enhanced passenger collection reset with new schema');
    } catch (error) {
        console.error('Error resetting collection:', error);
    }
});

const EnhancedPassenger = mongoose.model('EnhancedPassenger', enhancedPassengerSchema);

module.exports = EnhancedPassenger;