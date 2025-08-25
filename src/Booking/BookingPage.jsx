import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const BookingPage = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { bus, seats } = state || {};
	const [passengers, setPassengers] = useState(() =>
		seats ? seats.map(() => ({ name: "", age: "", gender: "" })) : []
	);
	const [contact, setContact] = useState({ email: "", phone: "" });

	const handlePassengerChange = (index, field, value) => {
		setPassengers((prev) => {
			const copy = [...prev];
			copy[index][field] = value;
			return copy;
		});
	};

	// Utility to dynamically load Razorpay script
	const loadRazorpay = () =>
		new Promise((resolve) => {
			if (window.Razorpay) return resolve(true);
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});

	const handleConfirm = async () => {
		try {
			const seatsPayload = seats.map((seatNo) => ({
				seatNumber: seatNo,
				price: totalFare,
			}));
			const body = {
				scheduleId: bus.scheduleId?._id || bus._id, // Ensure we always get the schedule ID
				seats: seatsPayload,
				passengers: passengers.map((p) => ({
					name: p.name.trim(),
					age: parseInt(p.age.trim()),
					gender: p.gender.trim(),
				})),
				contactDetails: {
					email: contact.email.trim(),
					phone: contact.phone.trim(),
				},
				totalAmount: parseFloat(grandTotal),
			};


			const initRes = await api.post("/booking/initialize", body);
			const { bookingId, razorpayOrderId, amount, currency, key } =
				initRes.data.data;

			const scriptLoaded = await loadRazorpay();
			if (!scriptLoaded) {
				alert("Razorpay SDK failed to load. Check your connection");
				return;
			}

			const options = {
				key,
				amount: amount * 100, // in paise if not already
				currency,
				order_id: razorpayOrderId,
				name: "Book My Bus",
				description: `Booking #${bookingId}`,
				handler: async function (response) {
					try {
						const confirmRes = await api.post("/booking/confirm", {
							bookingId,
							razorpayOrderId,
							razorpayPaymentId: response.razorpay_payment_id,
							razorpaySignature: response.razorpay_signature,
						});

						

						// Navigate to bookings page with success message
						navigate("/bookings", {
							state: {
								success: true,
								message: "Booking confirmed successfully",
							},
						});
					} catch (err) {
						console.error(err);
						alert("Payment verification failed");
					}
				},
				prefill: { email: contact.email, contact: contact.phone },
				theme: { color: "#16a34a" },
			};
			const rz = new window.Razorpay(options);
			rz.open();
		} catch (err) {
			console.error(err);
			alert("Booking failed – please try again");
		}
	};

	const allFilled =
		passengers.every(
			(p) => p.name.trim() && p.age.trim() && p.gender.trim()
		) &&
		contact.email.trim() &&
		contact.phone.trim();

	if (!bus || !seats) {
		// If user refreshes or comes directly, redirect back
		return (
			<div className='min-h-screen flex flex-col items-center justify-center text-center p-6'>
				<p className='text-lg mb-4'>Booking details are missing.</p>
				<button
					onClick={() => navigate(-1)}
					className='px-6 py-3 bg-Darkgreen text-white rounded-lg flex items-center gap-2 hover:bg-LightGreen'
				>
					<FaArrowLeft /> Go Back
				</button>
			</div>
		);
	}

	const totalFare =
		(bus.fareDetails?.baseFare || 0) +
		(bus.fareDetails?.tax || 0) +
		(bus.fareDetails?.serviceFee || 0);
	const grandTotal = totalFare * seats.length;

	return (
		<div className='min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-8'>
				{/* Header */}
				<div className='flex justify-between items-center'>
					<h2 className='text-2xl font-bold text-Darkgreen'>
						Confirm Your Booking
					</h2>
					<span className='px-3 py-1 bg-green-100 text-Darkgreen rounded-full text-sm font-medium'>
						{seats.length} seat{seats.length > 1 && "s"}
					</span>
				</div>

				{/* Trip Summary */}
				<section className='space-y-2'>
					<h3 className='text-lg font-semibold text-gray-800'>
						Trip Summary
					</h3>
					<p className='text-gray-600'>
						{bus.busName || bus.busId?.busName} •{" "}
						{bus.busType || bus.busId?.type}
					</p>
					<p className='text-gray-600'>
						From{" "}
						<span className='font-medium'>
							{bus.routeId?.source?.name}
						</span>{" "}
						to{" "}
						<span className='font-medium'>
							{bus.routeId?.destination?.name}
						</span>
					</p>
					<p className='text-gray-600'>Seats: {seats.join(", ")}</p>
					<p className='text-gray-600'>
						Date & Time: {new Date(bus.departureTime).toLocaleString()}
					</p>
				</section>

				{/* Fare Breakdown */}
				<section className='space-y-2'>
					<h3 className='text-lg font-semibold text-gray-800'>
						Fare Breakdown
					</h3>
					<div className='flex justify-between text-gray-700'>
						<span>Base Fare x {seats.length}</span>
						<span>₹{bus.fareDetails?.baseFare * seats.length}</span>
					</div>
					{bus.fareDetails?.tax > 0 && (
						<div className='flex justify-between text-gray-700'>
							<span>Tax</span>
							<span>₹{bus.fareDetails?.tax}</span>
						</div>
					)}
					{bus.fareDetails?.serviceFee > 0 && (
						<div className='flex justify-between text-gray-700'>
							<span>Service Fee</span>
							<span>₹{bus.fareDetails?.serviceFee}</span>
						</div>
					)}
					<div className='flex justify-between font-semibold text-gray-900 border-t pt-2'>
						<span>Total</span>
						<span>₹{grandTotal}</span>
					</div>
				</section>

				{/* Passenger Details */}
				<section className='space-y-4'>
					<h3 className='text-lg font-semibold text-gray-800'>
						Contact Details
					</h3>
					<input
						type='email'
						placeholder='Email'
						value={contact.email}
						onChange={(e) =>
							setContact({ ...contact, email: e.target.value })
						}
						className='w-full px-4 py-2 border rounded-lg focus:border-Darkgreen focus:outline-none'
					/>
					<input
						type='tel'
						placeholder='Phone'
						value={contact.phone}
						onChange={(e) =>
							setContact({ ...contact, phone: e.target.value })
						}
						className='w-full px-4 py-2 border rounded-lg focus:border-Darkgreen focus:outline-none'
					/>
				</section>

				<section className='space-y-4'>
					<h3 className='text-lg font-semibold text-gray-800'>
						Passenger Details
					</h3>
					{seats.map((seatNo, idx) => (
						<div
							key={seatNo}
							className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-gray-50 p-3 rounded-lg'
						>
							<span className='font-medium text-gray-700'>
								Seat {seatNo}
							</span>
							<input
								type='text'
								placeholder='Full Name'
								value={passengers[idx].name}
								onChange={(e) =>
									handlePassengerChange(idx, "name", e.target.value)
								}
								className='w-full px-4 py-2 border rounded-lg focus:border-Darkgreen focus:outline-none'
							/>
							<select
								value={passengers[idx].gender}
								onChange={(e) =>
									handlePassengerChange(idx, "gender", e.target.value)
								}
								className='w-full px-4 py-2 border rounded-lg focus:border-Darkgreen focus:outline-none'
							>
								<option value=''>Gender</option>
								<option value='male'>Male</option>
								<option value='female'>Female</option>
								<option value='other'>Other</option>
							</select>
							<input
								type='number'
								placeholder='Age'
								value={passengers[idx].age}
								onChange={(e) =>
									handlePassengerChange(idx, "age", e.target.value)
								}
								className='w-full px-4 py-2 border rounded-lg focus:border-Darkgreen focus:outline-none'
							/>
						</div>
					))}
				</section>

				{/* Confirm Button */}
				<button
					disabled={!allFilled}
					onClick={handleConfirm}
					className='w-full bg-Darkgreen disabled:bg-gray-400 text-white py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-LightGreen transition'
					type='button'
				>
					<FaCheckCircle className='mr-2' /> Confirm &amp; Pay ₹
					{grandTotal}
				</button>
			</div>
		</div>
	);
};

export default BookingPage;
