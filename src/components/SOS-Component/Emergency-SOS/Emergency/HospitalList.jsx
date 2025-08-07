import React, { useState, useEffect } from 'react';
import { emergencyService } from '../services/emergency.service';
import { toast } from 'react-toastify';
import { FaHospital, FaPhone, FaDirections, FaClock } from 'react-icons/fa';

const HospitalList = ({ latitude, longitude }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyHospitals();
    }
  }, [latitude, longitude]);

  const fetchNearbyHospitals = async () => {
    try {
      const response = await emergencyService.getNearbyHospitals(latitude, longitude);
      // Ensure we're getting an array from the response
      const hospitalData = response.data?.data || [];
      console.log('Hospital data:', hospitalData); // Debug log
      setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('Failed to fetch nearby hospitals');
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const getDistanceText = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const openDirections = (hospital) => {
    if (!latitude || !longitude) {
      toast.error('Current location not available');
      return;
    }

    // Check if we have coordinates or address
    let destination;
    if (hospital.latitude && hospital.longitude) {
      destination = `${hospital.latitude},${hospital.longitude}`;
    } else if (hospital.address) {
      // Encode the address for URL
      destination = encodeURIComponent(hospital.address);
    } else if (hospital.name) {
      // If only name is available, use that
      destination = encodeURIComponent(hospital.name);
    } else {
      toast.error('Unable to get hospital location');
      return;
    }

    // Create maps URL with current location as origin
    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!hospitals.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nearby Hospitals</h2>
        <p className="text-gray-600">No hospitals found in your area</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nearby Hospitals</h2>
        <p className="text-gray-600 mb-6">
          Showing hospitals within 5km of your current location
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((hospital, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FaHospital className="text-red-600 text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {hospital.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {hospital.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {getDistanceText(hospital.distance)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  {hospital.phone && (
                    <a
                      href={`tel:${hospital.phone}`}
                      className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaPhone className="mr-2" />
                      <span>{hospital.phone}</span>
                    </a>
                  )}
                  <button
                    onClick={() => openDirections(hospital)}
                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <FaDirections className="mr-2" />
                    <span>Directions</span>
                  </button>
                  {hospital.openingHours && (
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{hospital.openingHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalList;
