import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "././emergency.css";
import { FaPhone, FaHospital, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthProvider";

import EmergencyButton from "./Emergency-SOS/Emergency/EmergencyButton";
import EmergencyContacts from "./Emergency-SOS/Emergency/EmergencyContacts";
import HospitalList from "./Emergency-SOS/Emergency/HospitalList";
import SOSAlert from "./Emergency-SOS/Emergency/SOSAlert";
import LoadingSpinner from "./Emergency-SOS/common/LoadingSpinner";

import { getCurrentLocation } from "../../utils/helperGetLocation";
import { ERROR_MESSAGES } from "../../utils/constants";

function Emergency() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [sosDialogOpen, setSOSDialogOpen] = React.useState(false);
  const [alertData, setAlertData] = React.useState(null);
  const [showContacts, setShowContacts] = React.useState(false);
  const [showHospitals, setShowHospitals] = React.useState(false);

  React.useEffect(() => {
    const initializeLocation = async () => {
      try {
        const position = await getCurrentLocation();
        setLocation(position);
      } catch (error) {
        setError(ERROR_MESSAGES.LOCATION_ERROR);
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Check if user is authenticated--
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full backdrop-blur-sm bg-opacity-90">
          <div className="text-center">
            <FaShieldAlt className="mx-auto text-5xl text-red-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please log in to access emergency services and ensure your safety during travel.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Log In to Access Emergency Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Initializing emergency services..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-6"
              role="alert"
            >
              <div className="flex items-center">
                <div className="py-1">
                  <svg
                    className="w-6 h-6 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <EmergencyButton
              userId={user._id}
              onAlertTriggered={(data) => {
                setAlertData(data);
                setSOSDialogOpen(true);
              }}
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button
              onClick={() => {
                setShowContacts(true);
                setShowHospitals(false);
              }}
              className={`flex items-center justify-center px-8 py-4 rounded-xl shadow-lg transition-all duration-300 ${
                showContacts
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white transform scale-105"
                  : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
              }`}
            >
              <FaPhone className="text-xl mr-3" />
              <span className="font-semibold text-lg">Emergency Contacts</span>
            </button>
            <button
              onClick={() => {
                setShowHospitals(true);
                setShowContacts(false);
              }}
              className={`flex items-center justify-center px-8 py-4 rounded-xl shadow-lg transition-all duration-300 ${
                showHospitals
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white transform scale-105"
                  : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
              }`}
            >
              <FaHospital className="text-xl mr-3" />
              <span className="font-semibold text-lg">Nearby Hospitals</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="mt-8 transition-all duration-300">
            {showContacts && (
              <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300">
                <EmergencyContacts userId={user._id} />
              </div>
            )}
            {showHospitals && (
              <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300">
                {location ? (
                  <HospitalList
                    latitude={location.latitude}
                    longitude={location.longitude}
                  />
                ) : (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    {ERROR_MESSAGES.LOCATION_ERROR}
                  </div>
                )}
              </div>
            )}
          </div>

          <SOSAlert
            open={sosDialogOpen}
            onClose={() => setSOSDialogOpen(false)}
            alertData={alertData}
            loading={loading}
            error={error}
          />
        </div>
      </div>
      <ToastContainer 
        position="bottom-right" 
        className="mb-4 mr-4"
        toastClassName="bg-white shadow-xl rounded-lg"
      />
    </div>
  );
}

export default Emergency;
