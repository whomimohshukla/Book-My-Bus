import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import {
	FaBus,
	FaMapMarkerAlt,
	FaClock,
	FaRupeeSign,
	FaTicketAlt,
	FaUser,
	FaCalendarAlt,
} from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

function Bookings() {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("upcoming");
	const [bookings, setBookings] = useState({
		upcoming: [],
		past: [],
		cancelled: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login", { state: { from: "/bookings" } });
			return;
		}

		if (user?._id) {
			fetchBookings();
		} else {
			setLoading(false);
			setError("User information not available");
		}
	}, [user, isAuthenticated]);

	// Helper to dynamically load Razorpay script
	const loadRazorpay = () =>
		new Promise((resolve) => {
			if (window.Razorpay) return resolve(true);
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});

	const handleRetryPayment = async (booking) => {
		try {
			const loaded = await loadRazorpay();
			if (!loaded) {
				alert("Failed to load payment gateway.");
				return;
			}

			// Create new order
			const retryRes = await axiosInstance.post(
				"/api/booking/retry-payment",
				{
					bookingId: booking._id,
				}
			);
			const { key, amount, currency, razorpayOrderId } = retryRes.data.data;

			const options = {
				key,
				amount: amount * 100, // Razorpay expects paise; backend sends in rupees
				currency,
				name: "BookMyBus",
				description: `Payment for booking ${booking._id}`,
				order_id: razorpayOrderId,
				handler: async function (response) {
					const {
						razorpay_payment_id,
						razorpay_order_id,
						razorpay_signature,
					} = response;
					try {
						await axiosInstance.post(
							"/api/booking/confirm",
							{
								bookingId: booking._id,
								razorpayOrderId: razorpay_order_id,
								razorpayPaymentId: razorpay_payment_id,
								razorpaySignature: razorpay_signature,
							},
							{ timeout: 20000 }
						);
						// Refresh list
						fetchBookings();
						alert("Payment successful and booking confirmed");
					} catch (err) {
						console.error("Confirm error", err);
						if (err.code === "ECONNABORTED") {
							alert(
								"Verification taking longer than expected. Please refresh in a few seconds to see updated status."
							);
						} else {
							alert("Payment verification failed");
						}
					}
				},
				prefill: booking.contactDetails,
				modal: {
					ondismiss: () => {
						// do nothing – booking stays pending
					},
				},
				theme: { color: "#16a34a" },
			};

			const rz = new window.Razorpay(options);
			rz.open();
		} catch (err) {
			console.error("Retry payment error:", err);
			alert(err.response?.data?.message || "Failed to start payment");
		}
	};

	const fetchBookings = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await axiosInstance.get(`/api/booking/user-bookings`);

			const serverData = response.data.data;
			let sorted;

			// If backend already returns categorized bookings (upcoming/past/cancelled)
			if (
				serverData &&
				serverData.upcoming &&
				serverData.past &&
				serverData.cancelled
			) {
				sorted = serverData;
			} else {
				// Backend returned a flat array – categorize on frontend
				const allBookings = Array.isArray(serverData) ? serverData : [];
				sorted = {
					upcoming: [],
					past: [],
					cancelled: [],
				};
				allBookings.forEach((booking) => {
					const departureTime = new Date(booking.scheduleId.departureTime);
					const now = new Date();
					if (booking.status === "cancelled") {
						sorted.cancelled.push(booking);
					} else if (departureTime < now) {
						sorted.past.push(booking);
					} else {
						sorted.upcoming.push(booking);
					}
				});

				// Sort each category by departure time
				Object.keys(sorted).forEach((key) => {
					sorted[key].sort(
						(a, b) =>
							new Date(b.scheduleId.departureTime) -
							new Date(a.scheduleId.departureTime)
					);
				});
			}

			// Ensure arrays exist even if empty
			["upcoming", "past", "cancelled"].forEach((k) => {
				sorted[k] = sorted[k] || [];
			});

			// Decide which tab should be active
			let desiredTab = activeTab;
			if (sorted[desiredTab].length === 0) {
				desiredTab =
					["upcoming", "past", "cancelled"].find(
						(k) => sorted[k].length > 0
					) || desiredTab;
			}
			setActiveTab(desiredTab);
			// console.log('Bookings sorted:', sorted);
			window.__bookingsDebug__ = sorted;
			setBookings(sorted);
		} catch (error) {
			console.error("Fetch bookings error:", error);
			setError(
				error.response?.data?.message ||
					error.message ||
					"Failed to fetch bookings"
			);

			if (error.response?.status === 401) {
				navigate("/login", { state: { from: "/bookings" } });
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCancelBooking = async (bookingId) => {
		try {
			const confirmed = window.confirm(
				"Are you sure you want to cancel this booking?"
			);
			if (!confirmed) return;

			await axiosInstance.put(`/api/booking/${bookingId}/cancel`, {
				reason: "Customer requested cancellation",
			});

			// Show success message
			setError({
				type: "success",
				message: "Booking cancelled successfully",
			});

			// Clear success message after 3 seconds
			setTimeout(() => {
				setError(null);
			}, 3000);

			fetchBookings(); // Refresh bookings list
		} catch (error) {
			setError(error.message || "Failed to cancel booking");

			// Clear error message after 3 seconds
			setTimeout(() => {
				setError(null);
			}, 3000);
		}
	};

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "confirmed":
				return "bg-green-100 text-green-800 border border-green-200";
			case "completed":
				return "bg-blue-100 text-blue-800 border border-blue-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border border-yellow-200";
			case "cancelled":
				return "bg-red-100 text-red-800 border border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border border-gray-200";
		}
	};

	const formatDateTime = (dateString) => {
		return new Date(dateString).toLocaleString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const renderBookingCard = (booking) => (
		<div
			key={booking._id}
			className='bg-white rounded-lg shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow'
		>
			{/* Header Section */}
			<div className='bg-gray-50 p-3 md:p-4 border-b border-gray-200'>
				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2'>
					<div className='flex items-center space-x-2'>
						<FaBus className='text-Darkgreen text-xl' />
						<h3 className='text-lg md:text-xl font-semibold text-gray-800'>
							{booking.scheduleId?.busId?.busNumber || "Bus"}
							{booking.scheduleId?.busId?.busType
								? ` - ${booking.scheduleId.busId.busType}`
								: ""}
						</h3>
					</div>
					<span
						className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
							booking.paymentStatus === "pending"
								? "pending"
								: booking.status
						)} w-fit`}
					>
						{booking.paymentStatus === "pending"
							? "Pending Payment"
							: booking.status}
					</span>
				</div>
				<p className='text-sm text-gray-600'>
					<span className='font-medium'>Booking ID:</span> {booking._id}
				</p>
			</div>

			{/* Journey Details */}
			<div className='p-4 md:p-6'>
				<div className='flex flex-col sm:flex-row items-center justify-between gap-6 mb-6'>
					<div className='flex-1 w-full sm:w-auto'>
						<div className='relative pl-8'>
							<FaMapMarkerAlt className='absolute left-0 top-0 text-green-600' />
							<p className='text-sm text-gray-600'>From</p>
							<p className='font-semibold text-gray-800'>
								{booking.scheduleId?.routeId?.source?.name || "Source"}
							</p>
						</div>
					</div>

					<div className='hidden sm:flex flex-1 justify-center'>
						<div className='w-32 h-0.5 bg-gray-300 relative'>
							<div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
								<FaBus className='text-Darkgreen transform -rotate-90' />
							</div>
						</div>
					</div>

					<div className='flex-1 w-full sm:w-auto'>
						<div className='relative pl-8'>
							<FaMapMarkerAlt className='absolute left-0 top-0 text-red-600' />
							<p className='text-sm text-gray-600'>To</p>
							<p className='font-semibold text-gray-800'>
								{booking.scheduleId?.routeId?.destination?.name ||
									"Destination"}
							</p>
						</div>
					</div>
				</div>

				{/* Time and Date Details */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 bg-gray-50 p-4 rounded-lg'>
					<div className='flex items-center space-x-3'>
						<FaCalendarAlt className='text-gray-600' />
						<div>
							<p className='text-sm text-gray-600'>Departure</p>
							<p className='font-medium text-gray-800'>
								{formatDateTime(booking.scheduleId?.departureTime)}
							</p>
						</div>
					</div>
					<div className='flex items-center space-x-3'>
						<FaClock className='text-gray-600' />
						<div>
							<p className='text-sm text-gray-600'>Arrival</p>
							<p className='font-medium text-gray-800'>
								{formatDateTime(booking.scheduleId?.arrivalTime)}
							</p>
						</div>
					</div>
				</div>

				{/* Passenger Details */}
				<div className='mb-6'>
					<h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
						<FaUser className='mr-2' />
						Passenger Details
					</h4>
					<div className='space-y-3'>
						{booking.passengers.map((passenger, index) => (
							<div
								key={index}
								className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'
							>
								<div className='flex items-center space-x-4'>
									<div className='bg-Darkgreen text-white p-2 rounded-full'>
										<FaUser />
									</div>
									<div>
										<p className='font-medium text-gray-800'>
											{passenger.name}
										</p>
										<p className='text-sm text-gray-600'>
											{passenger.age} yrs
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									<MdAirlineSeatReclineNormal className='text-gray-600' />
									<span className='font-medium text-gray-800'>
										{booking.seats[index].seatNumber}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Footer Section */}
				<div className='flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200'>
					<div className='flex items-center space-x-2'>
						<FaRupeeSign className='text-Darkgreen text-xl' />
						<div>
							<p className='text-sm text-gray-600'>Total Fare</p>
							<p className='text-xl font-bold text-Darkgreen'>
								₹{booking.totalAmount}
							</p>
						</div>
					</div>

					<div className='flex flex-wrap gap-3'>
            {booking.paymentStatus === "pending" ? (
              <button
                onClick={() => handleRetryPayment(booking)}
                className='flex items-center px-3 md:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm md:text-base transition'
              >
                Pay&nbsp;Now
              </button>
            ) : ["confirmed", "booked", "completed"].includes(
                (booking.status || "").toLowerCase()
              ) && (
              <>
                {/* View Ticket */}
                <button
                  onClick={() => navigate(`/ticket/${booking._id}`)}
                  className='flex items-center px-3 md:px-4 py-2 bg-Darkgreen text-white rounded-md hover:bg-green-700 transition-colors text-sm md:text-base'
                >
                  <FaTicketAlt className='mr-2' />
                  View Ticket
                </button>

                {/* Track Bus */}
                {(() => {
                  const extractId = (v) =>
                    typeof v === "string" ? v : v?._id || v?.id || "";
                  const rawBusId =
                    extractId(booking.busId) || extractId(booking.scheduleId?.busId);
                  if (!rawBusId) return null;
                  return (
                    <Link
                      to={`/live-tracking/${rawBusId}`}
                      className='flex items-center px-3 md:px-4 py-2 bg-Darkgreen text-white rounded-md hover:bg-green-700 transition-colors text-sm md:text-base'
                    >
                      <FaBus className='mr-2' />
                      Track&nbsp;Bus
                    </Link>
                  );
                })()}

                {/* Cancel Booking */}
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className='px-3 md:px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors text-sm md:text-base'
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
		<div className='min-h-screen bg-gray-100 pt-24 md:pt-28 pb-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-5xl mx-auto'>
				{/* Header */}
				<div className='bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6'>
					<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
						<h1 className='text-xl md:text-2xl font-bold text-gray-900'>
							My Bookings
						</h1>
						<div className='flex items-center space-x-4 w-full sm:w-auto'>
							<select
								className='w-full sm:w-auto form-select rounded-md border-gray-300 shadow-sm focus:border-Darkgreen focus:ring focus:ring-green-200 px-4 py-2'
								onChange={(e) => setActiveTab(e.target.value)}
								value={activeTab}
							>
								<option value='upcoming'>Upcoming</option>
								<option value='past'>Past</option>
								<option value='cancelled'>Cancelled</option>
							</select>
						</div>
					</div>
				</div>

				{/* Error/Success Messages */}
				{error && (
					<div
						className={`mb-4 p-4 rounded-md ${
							error.type === "success"
								? "bg-green-50 text-green-700 border border-green-200"
								: "bg-red-50 text-red-700 border border-red-200"
						}`}
					>
						{error.message}
					</div>
				)}

				{/* Loading State */}
				{loading ? (
					<div className='bg-white rounded-lg shadow-md p-8 text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-Darkgreen mx-auto'></div>
						<p className='mt-4 text-gray-600'>Loading bookings...</p>
					</div>
				) : (
					/* Booking Cards */
					<div className='space-y-6'>
						{bookings[activeTab].length > 0 ? (
							bookings[activeTab].map((booking) =>
								renderBookingCard(booking)
							)
						) : (
							<div className='bg-white rounded-lg shadow-md p-8 text-center'>
								<FaTicketAlt className='mx-auto text-4xl text-gray-400 mb-4' />
								<p className='text-xl font-medium text-gray-600 mb-2'>
									No {activeTab} bookings found
								</p>
								<p className='text-gray-500'>
									When you book a trip, it will appear here.
								</p>
								<button
									onClick={() => navigate("/searchBuses")}
									className='mt-4 px-6 py-2 bg-Darkgreen text-white rounded-md hover:bg-green-700 transition-colors'
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
