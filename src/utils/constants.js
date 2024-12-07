// utils/constants.js
export const API_BASE_URL = 'http://localhost:8000/api';

export const EMERGENCY_TYPES = {
    MEDICAL: 'medical',
    SECURITY: 'security',
    ACCIDENT: 'accident',
    FIRE: 'fire',
    OTHER: 'other'
};

export const DEFAULT_RADIUS = 5000; // 5km radius for nearby hospitals

export const ERROR_MESSAGES = {
    LOCATION_ERROR: 'Unable to get your location. Please enable location services.',
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    CONTACT_ERROR: 'Error managing emergency contacts.',
    HOSPITAL_ERROR: 'Error fetching nearby hospitals.'
};

