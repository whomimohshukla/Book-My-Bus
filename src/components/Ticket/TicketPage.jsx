import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { FaBus, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUser, FaRupeeSign, FaPrint } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

const TicketPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/booking/details/${bookingId}`);
        setBooking(res.data.data);
      } catch (err) {
        console.error('Ticket fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Darkgreen mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-24 space-y-4">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-Darkgreen text-white rounded-md">Go Back</button>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:max-w-none print:shadow-none print:bg-white">
        {/* Header */}
        <div className="bg-Darkgreen text-white p-6 flex justify-between items-center print:bg-white print:text-black">
          <div className="flex items-center space-x-3 text-xl font-semibold">
            <FaBus />
            <span>Bus Ticket</span>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-Darkgreen rounded-md shadow print:hidden"
          >
            <FaPrint />
            <span>Print</span>
          </button>
        </div>

        {/* Journey section */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Source */}
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="text-lg font-medium text-gray-800">
                  {booking.scheduleId?.routeId?.source?.name || 'Source'}
                </p>
              </div>
            </div>
            {/* Destination */}
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-red-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="text-lg font-medium text-gray-800">
                  {booking.scheduleId?.routeId?.destination?.name || 'Destination'}
                </p>
              </div>
            </div>
            {/* Departure */}
            <div className="flex items-start space-x-4">
              <FaCalendarAlt className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="text-lg font-medium text-gray-800">
                  {formatDateTime(booking.scheduleId?.departureTime)}
                </p>
              </div>
            </div>
            {/* Arrival */}
            <div className="flex items-start space-x-4">
              <FaClock className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Arrival</p>
                <p className="text-lg font-medium text-gray-800">
                  {formatDateTime(booking.scheduleId?.arrivalTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Bus & Booking Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div className="space-y-2">
              <p><span className="text-gray-600">Bus:</span> <span className="font-medium">{booking.scheduleId?.busId?.busNumber}</span></p>
              <p><span className="text-gray-600">Status:</span> <span className="font-medium capitalize">{booking.status}</span></p>
              <p><span className="text-gray-600">Payment:</span> <span className="font-medium capitalize">{booking.paymentStatus}</span></p>
            </div>
            <div className="space-y-2">
              <p><span className="text-gray-600">Booking ID:</span> <span className="font-medium">{booking._id}</span></p>
              <p><span className="text-gray-600">Booked On:</span> <span className="font-medium">{formatDateTime(booking.createdAt)}</span></p>
              <p><span className="text-gray-600">Total Fare:</span> <span className="font-medium">₹{booking.totalAmount}</span></p>
            </div>
          </div>

          {/* Passengers */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center"><FaUser className="mr-2" />Passengers</h3>
            <div className="space-y-3">
              {booking.passengers.map((p, idx) => (
                <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-Darkgreen text-white p-2 rounded-full"><FaUser /></div>
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.age} yrs</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MdAirlineSeatReclineNormal className="text-gray-600" />
                    <span className="font-medium text-gray-800">{booking.seats[idx]?.seatNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fare Summary */}
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <div className="flex items-center space-x-2 text-xl font-bold text-Darkgreen">
              <FaRupeeSign />
              <span>{booking.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
