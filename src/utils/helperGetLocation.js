// utils/helpers.js
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatPhoneNumber = (phoneNumber) => {
  // Add your phone number formatting logic here
  return phoneNumber;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  // Add your phone validation logic here
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phoneNumber);
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    // First check if we have permission
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
      if (permissionStatus.state === 'denied') {
        reject(new Error("Location permission is denied. Please enable location services in your browser settings."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Check accuracy of the position
          if (position.coords.accuracy > 100) { // accuracy is in meters
            console.warn("Warning: Location accuracy is low (>100m). Please ensure GPS is enabled for better accuracy.");
          }
          
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let errorMessage = "Failed to get location: ";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location permission denied.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information unavailable. Please check your GPS settings.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out. Please try again.";
              break;
            default:
              errorMessage += error.message;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,      // Increased timeout to 10 seconds
          maximumAge: 0
        }
      );
    });
  });
};
