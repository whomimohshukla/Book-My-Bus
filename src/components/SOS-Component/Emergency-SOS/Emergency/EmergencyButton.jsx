import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaPhoneVolume } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { emergencyService } from '../services/emergency.service';
import './EmergencyButton.css';

function EmergencyButton({ userId, onAlertTriggered }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState('medical');
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    // Start pulsing animation
    const pulseInterval = setInterval(() => {
      setPulsing(prev => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency 🚑', color: 'from-rose-500 to-rose-600' },
    { value: 'security', label: 'Security Emergency 🚨', color: 'from-blue-500 to-blue-600' },
    { value: 'accident', label: 'Accident 🚗', color: 'from-amber-500 to-amber-600' },
    { value: 'other', label: 'Other Emergency ⚠️', color: 'from-purple-500 to-purple-600' }
  ];

  const handleEmergencyCall = async () => {
    if (!userId) {
      toast.error('User ID is required. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const data = {
        userId,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        emergencyType: selectedEmergencyType,
        description: `Emergency assistance required - ${selectedEmergencyType} emergency`
      };

      const response = await emergencyService.triggerSOS(data);
      
      if (response.data && response.data.success) {
        onAlertTriggered(response.data);
        toast.success('Emergency services have been notified!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: "🚨"
        });
      } else {
        throw new Error(response.data?.message || 'Failed to trigger emergency alert');
      }
    } catch (error) {
      console.error('Error triggering emergency alert:', error);
      toast.error(error.response?.data?.message || 'Failed to trigger emergency alert');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center">
        {/* Ripple effects */}
        <div className={`absolute ripple-effect ${pulsing ? 'animate-ripple' : ''}`}></div>
        <div className={`absolute ripple-effect delay-300 ${pulsing ? 'animate-ripple' : ''}`}></div>
        
        {/* Main SOS button */}
        <button
          onClick={() => setOpen(true)}
          className={`
            sos-button
            relative
            mt-24
            w-48 h-48 md:w-64 md:h-64
            rounded-full
            bg-gradient-to-r from-red-600 to-red-700
            hover:from-red-700 hover:to-red-800
            shadow-[0_0_30px_rgba(220,38,38,0.5)]
            transform
            hover:scale-105
            transition-all duration-300
            focus:outline-none
            focus:ring-4
            focus:ring-red-500
            focus:ring-opacity-50
            ${loading ? 'animate-pulse' : ''}
            disabled:opacity-50
            disabled:cursor-not-allowed
          `}
          disabled={loading}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FaExclamationTriangle className={`
              text-4xl md:text-6xl text-white mb-4
              transform transition-transform duration-300
              ${loading ? 'animate-bounce' : 'hover:scale-110'}
            `} />
            <span className="text-xl md:text-2xl font-bold text-white tracking-wider">
              {loading ? 'Sending Alert...' : 'SOS'}
            </span>
          </div>
        </button>

        {/* Help text */}
        <p className="mt-4 text-gray-600 text-center animate-pulse">
          Press for Emergency Assistance
        </p>
      </div>

      {/* Emergency Type Selection Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100 opacity-100 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaExclamationTriangle className="text-2xl text-rose-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Confirm Emergency Alert
              </h2>
              <p className="text-gray-500 text-sm">
                Select emergency type
              </p>
            </div>

            {/* Emergency Types Grid */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              {emergencyTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedEmergencyType(type.value);
                    handleEmergencyCall();
                  }}
                  className={`
                    relative overflow-hidden
                    w-full py-3 px-4 rounded-lg
                    bg-gradient-to-r ${type.color}
                    text-white font-medium
                    transform transition-all duration-300
                    hover:scale-[1.02] hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    flex items-center
                    group
                  `}
                >
                  {/* Button Content */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{type.label.split(' ')[1]}</span>
                      <span className="text-sm font-medium opacity-90">
                        {type.label.split(' ')[0]}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center
                                transform transition-transform duration-300 group-hover:scale-110">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black/10 transform -translate-x-full hover:translate-x-0 transition-transform duration-300" />
                </button>
              ))}
            </div>

            {/* Cancel Button */}
            <div className="text-center">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium
                  hover:bg-gray-200 transition-colors duration-300
                  flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              
              <p className="mt-2 text-xs text-gray-400">
                Press ESC to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;
