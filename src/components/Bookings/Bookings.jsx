import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaBus, FaMapMarkerAlt, FaClock, FaRupeeSign, FaTicketAlt, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

function Bookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Dummy data for demonstration
  const dummyBookings = {
    upcoming: [
      {
        id: 'BK001',
        busName: 'Express Liner AC Sleeper',
        from: 'Mumbai',
        to: 'Pune',
        departureDate: '2024-03-25',
        departureTime: '10:00 AM',
        arrivalTime: '01:00 PM',
        seatNumbers: ['A1', 'A2'],
        status: 'Confirmed',
        price: 800,
        busType: 'AC Sleeper',
        boardingPoint: 'Dadar Bus Stand',
        droppingPoint: 'Pune Station',
        passengers: [
          { name: 'John Doe', age: 28, seatNo: 'A1', gender: 'Male' },
          { name: 'Jane Doe', age: 25, seatNo: 'A2', gender: 'Female' }
        ]
      },
      {
        id: 'BK002',
        busName: 'Night Rider Volvo',
        from: 'Delhi',
        to: 'Jaipur',
        departureDate: '2024-04-01',
        departureTime: '11:30 PM',
        arrivalTime: '05:30 AM',
        seatNumbers: ['B3'],
        status: 'Confirmed',
        price: 1200,
        busType: 'Volvo AC',
        boardingPoint: 'Kashmere Gate ISBT',
        droppingPoint: 'Jaipur Central Bus Stand',
        passengers: [
          { name: 'Alice Smith', age: 30, seatNo: 'B3', gender: 'Female' }
        ]
      }
    ],
    past: [
      {
        id: 'BK003',
        busName: 'City Connect',
        from: 'Bangalore',
        to: 'Chennai',
        departureDate: '2024-02-15',
        departureTime: '08:00 AM',
        arrivalTime: '02:00 PM',
        seatNumbers: ['C4'],
        status: 'Completed',
        price: 1500,
        busType: 'Non-AC Seater',
        boardingPoint: 'Majestic Bus Stand',
        droppingPoint: 'Chennai Central Bus Stand',
        passengers: [
          { name: 'Bob Wilson', age: 35, seatNo: 'C4', gender: 'Male' }
        ]
      }
    ],
    cancelled: [
      {
        id: 'BK004',
        busName: 'Super Express',
        from: 'Hyderabad',
        to: 'Vijayawada',
        departureDate: '2024-03-10',
        departureTime: '09:00 AM',
        arrivalTime: '01:00 PM',
        seatNumbers: ['D5'],
        status: 'Cancelled',
        price: 900,
        busType: 'AC Sleeper',
        boardingPoint: 'Secunderabad Bus Stand',
        droppingPoint: 'Vijayawada Bus Stand',
        passengers: [
          { name: 'Charlie Brown', age: 40, seatNo: 'D5', gender: 'Male' }
        ]
      }
    ]
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

  const renderBookingCard = (booking) => (
    <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <div className="bg-gray-50 p-3 md:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <FaBus className="text-Darkgreen text-xl" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">{booking.busName}</h3>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)} w-fit`}>
            {booking.status}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Booking ID:</span> {booking.id} | 
          <span className="font-medium ml-2">Bus Type:</span> {booking.busType}
        </p>
      </div>

      {/* Journey Details */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative pl-8">
              <FaMapMarkerAlt className="absolute left-0 top-0 text-green-600" />
              <p className="text-sm text-gray-600">From</p>
              <p className="font-semibold text-gray-800">{booking.from}</p>
              <p className="text-sm text-gray-600">{booking.boardingPoint}</p>
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
              <p className="font-semibold text-gray-800">{booking.to}</p>
              <p className="text-sm text-gray-600">{booking.droppingPoint}</p>
            </div>
          </div>
        </div>

        {/* Time and Date Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Travel Date</p>
              <p className="font-medium text-gray-800">
                {new Date(booking.departureDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaClock className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium text-gray-800">
                {booking.departureTime} - {booking.arrivalTime}
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
                    <p className="text-sm text-gray-600">
                      {passenger.age} yrs | {passenger.gender}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MdAirlineSeatReclineNormal className="text-gray-600" />
                  <span className="font-medium text-gray-800">{passenger.seatNo}</span>
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
              <p className="text-xl font-bold text-Darkgreen">₹{booking.price}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {booking.status === 'Confirmed' && (
              <>
                <button 
                  onClick={() => navigate(`/ticket/${booking.id}`)}
                  className="flex items-center px-3 md:px-4 py-2 bg-Darkgreen text-white rounded-md hover:bg-green-700 transition-colors text-sm md:text-base"
                >
                  <FaTicketAlt className="mr-2" />
                  View Ticket
                </button>
                <button 
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

        {/* Booking Cards */}
        <div className="space-y-6">
          {dummyBookings[activeTab].length > 0 ? (
            dummyBookings[activeTab].map(booking => renderBookingCard(booking))
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
      </div>
    </div>
  );
}

export default Bookings;
