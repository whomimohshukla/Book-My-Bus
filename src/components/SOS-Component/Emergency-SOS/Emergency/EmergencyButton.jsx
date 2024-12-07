import React, { useState } from 'react';
import { FaExclamationTriangle, FaPhoneVolume } from 'react-icons/fa';
import { toast } from 'react-toastify';

function EmergencyButton({ userId, onAlertTriggered }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEmergencyCall = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response data
      const mockResponse = {
        success: true,
        message: "Emergency alert triggered successfully",
        data: {
          alertId: "mock-alert-123",
          timestamp: new Date().toISOString(),
          userId: userId,
          status: "ACTIVE"
        }
      };

      onAlertTriggered(mockResponse.data);
      toast.success('Emergency services have been notified!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error triggering emergency alert:', error);
      toast.error('Failed to trigger emergency alert. Please try again.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="group relative mt-24 w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-2xl transform hover:scale-105 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          disabled={loading}
        >
          {/* Pulse Effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-red-600 opacity-20"></div>
          
          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white transform transition-transform duration-300 group-hover:scale-110">
            <FaExclamationTriangle className="text-5xl md:text-6xl mb-4" />
            <span className="text-2xl md:text-3xl font-bold tracking-wider">SOS</span>
            <span className="text-sm md:text-base mt-2 opacity-90">Tap for Emergency</span>
          </div>
        </button>

        {/* Emergency Call Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <FaPhoneVolume className="text-3xl text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Confirm Emergency Call
                </h3>
                <p className="text-gray-600 mb-8">
                  This will alert emergency services and your emergency contacts. Are you sure you want to proceed?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleEmergencyCall}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Alerting..." : "Yes, Get Help Now"}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EmergencyButton;
