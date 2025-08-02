import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { FaBus, FaMapMarkerAlt, FaClock, FaRupeeSign, FaTicketAlt, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

function Bookings() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/bookings' } });
      return;
    }

    if (user?._id) {
      fetchBookings();
    } else {
      setLoading(false);
      setError('User information not available');
    }
  }, [user, isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/api/booking/user/${user._id}`);
      
      // Sort bookings based on status and date
      const allBookings = response.data.data;
      const sorted = {
        upcoming: [],
        past: [],
        cancelled: []
      };

      allBookings.forEach(booking => {
        const departureTime = new Date(booking.scheduleId.departureTime);
        const now = new Date();

        if (booking.status === 'cancelled') {
          sorted.cancelled.push(booking);
        } else if (departureTime < now) {
          sorted.past.push(booking);
        } else {
          sorted.upcoming.push(booking);
        }
      });

      // Sort each category by departure time
      Object.keys(sorted).forEach(key => {
        sorted[key].sort((a, b) => 
          new Date(b.scheduleId.departureTime) - new Date(a.scheduleId.departureTime)
        );
      });

      setBookings(sorted);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
      
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: '/bookings' } });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to cancel this booking?');
      if (!confirmed) return;

      await axiosInstance.put(`/api/booking/${bookingId}/cancel`, {
        reason: 'Customer requested cancellation'
      });

      // Show success message
      setError({ type: 'success', message: 'Booking cancelled successfully' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);

      fetchBookings(); // Refresh bookings list
    } catch (error) {
      setError(error.message || 'Failed to cancel booking');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderBookingCard = (booking) => (
    <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <div className="bg-gray-50 p-3 md:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <FaBus className="text-Darkgreen text-xl" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              {booking.scheduleId.busId.busNumber} - {booking.scheduleId.busId.busType}
            </h3>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)} w-fit`}>
            {booking.status}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Booking ID:</span> {booking._id}
        </p>
      </div>

      {/* Journey Details */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative pl-8">
              <FaMapMarkerAlt className="absolute left-0 top-0 text-green-600" />
              <p className="text-sm text-gray-600">From</p>
              <p className="font-semibold text-gray-800">{booking.scheduleId.routeId.source.name}</p>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="w-32 h-0.5 bg-gray-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <FaBus className="text-Darkgreen transform -rotate-90" />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <div className="relative pl-8">
              <FaMapMarkerAlt className="absolute left-0 top-0 text-red-600" />
              <p className="text-sm text-gray-600">To</p>
              <p className="font-semibold text-gray-800">{booking.scheduleId.routeId.destination.name}</p>
            </div>
          </div>
        </div>

        {/* Time and Date Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Departure</p>
              <p className="font-medium text-gray-800">
                {formatDateTime(booking.scheduleId.departureTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaClock className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Arrival</p>
              <p className="font-medium text-gray-800">
                {formatDateTime(booking.scheduleId.arrivalTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <FaUser className="mr-2" />
            Passenger Details
          </h4>
          <div className="space-y-3">
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-Darkgreen text-white p-2 rounded-full">
                    <FaUser />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{passenger.name}</p>
                    <p className="text-sm text-gray-600">{passenger.age} yrs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MdAirlineSeatReclineNormal className="text-gray-600" />
                  <span className="font-medium text-gray-800">{booking.seats[index].seatNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <FaRupeeSign className="text-Darkgreen text-xl" />
            <div>
              <p className="text-sm text-gray-600">Total Fare</p>
              <p className="text-xl font-bold text-Darkgreen">₹{booking.totalAmount}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {booking.status === 'confirmed' && (
              <>
                <button 
                  onClick={() => navigate(`/ticket/${booking._id}`)}
                  className="flex items-center px-3 md:px-4 py-2 bg-Darkgreen text-white rounded-md hover:bg-green-700 transition-colors text-sm md:text-base"
                >
                  <FaTicketAlt className="mr-2" />
                  View Ticket
                </button>
                <button 
                  onClick={() => handleCancelBooking(booking._id)}
                  className="px-3 md:px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 md:pt-28 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Bookings</h1>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <select 
                className="w-full sm:w-auto form-select rounded-md border-gray-300 shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200 px-4 py-2"
                onChange={(e) => setActiveTab(e.target.value)}
                value={activeTab}
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`mb-4 p-4 rounded-md ${
            error.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {error.message}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Darkgreen mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          /* Booking Cards */
          <div className="space-y-6">
            {bookings[activeTab].length > 0 ? (
              bookings[activeTab].map(booking => renderBookingCard(booking))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaTicketAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-xl font-medium text-gray-600 mb-2">No {activeTab} bookings found</p>
                <p className="text-gray-500">When you book a trip, it will appear here.</p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-4 px-6 py-2 bg-Darkgreen text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Book a Bus
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
