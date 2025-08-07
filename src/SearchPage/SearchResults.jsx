import React, { useState } from "react";
import SeatDrawer from "./SeatDrawer";
import {
	FaFilter,
	FaBus,
	FaCalendarAlt,
	FaMapSigns,
	FaArrowRight,
	FaClock,
	FaRupeeSign,
	FaRegClock,
	FaMapMarkerAlt,
	FaWifi,
	FaSnowflake,
	FaChargingStation,
	FaToilet,
	FaExchangeAlt,
	FaSearch,
	FaStar,
	FaChevronDown,
	FaChevronUp,
	FaUser,
	FaPhone,
	FaCar,
	FaRoute,
	FaLocationArrow,
	FaRegCompass,
	FaShieldAlt,
	FaCouch,
	FaCoffee,
	FaTv,
	FaMusic,
	FaFirstAid,
	FaAward,
	FaCheck,
	FaChevronRight,
} from "react-icons/fa";
import { BiDrink } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

const SearchResults = ({ results }) => {
	const [openBus, setOpenBus] = useState(null);
	const [expandedId, setExpandedId] = useState(null);
	const [filters, setFilters] = useState({
		busType: "all",
		priceRange: [0, 5000],
		departureTime: "all",
		amenities: [],
	});

	const handleExpandClick = (id) => {
		setExpandedId(expandedId === id ? null : id);
		// Debug log to see the bus data when expanded
		const bus = results.find((b) => b._id === id);
		// console.log('Expanded Bus Data:', bus);
		// console.log('Route ID Data:', bus?.routeId);
		// console.log('Via Stops:', bus?.routeId?.viaStops);
	};

	const sortResults = (items) => {
		return [...items].sort((a, b) => {
			switch (filters.busType) {
				case "price":
					return (
						(a.fareDetails?.baseFare || 0) -
						(b.fareDetails?.baseFare || 0)
					);
				case "duration":
					return (
						new Date(a.arrivalTime) -
						new Date(a.departureTime) -
						(new Date(b.arrivalTime) - new Date(b.departureTime))
					);
				case "departure":
					return new Date(a.departureTime) - new Date(b.departureTime);
				case "seats":
					return b.availableSeats - a.availableSeats;
				default:
					return 0;
			}
		});
	};

	const filterResults = (items) => {
		if (filters.busType === "all") return items;
		return items.filter((bus) => {
			switch (filters.busType) {
				case "ac":
					return bus.busId?.type === "AC";
				case "nonAc":
					return bus.busId?.type !== "AC";
				case "sleeper":
					return bus.busId?.type?.toLowerCase().includes("sleeper");
				case "seater":
					return bus.busId?.type?.toLowerCase().includes("seater");
				default:
					return true;
			}
		});
	};

	const formatTime = (timeString) => {
		try {
			const date = new Date(timeString);
			return date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		} catch (error) {
			console.error("Error formatting time:", error);
			return timeString;
		}
	};

	const calculateDuration = (departure, arrival) => {
		try {
			const start = new Date(departure);
			const end = new Date(arrival);
			const diffInMinutes = Math.floor((end - start) / (1000 * 60));

			const hours = Math.floor(diffInMinutes / 60);
			const minutes = diffInMinutes % 60;

			if (hours === 0) {
				return `${minutes}m`;
			} else if (minutes === 0) {
				return `${hours}h`;
			} else {
				return `${hours}h ${minutes}m`;
			}
		} catch (error) {
			console.error("Error calculating duration:", error);
			return "Duration N/A";
		}
	};

	const calculateTotalFare = (fareDetails) => {
		if (!fareDetails) return "N/A";
		const { baseFare = 0, tax = 0, serviceFee = 0 } = fareDetails;
		return baseFare + tax + serviceFee;
	};

	const amenityIcons = {
		WiFi: <FaWifi />,
		AC: <FaSnowflake />,
		"Charging Point": <FaChargingStation />,
		Water: <BiDrink />,
		Entertainment: <FaTv />,
		"Comfortable Seats": <FaCouch />,
		"First Aid": <FaFirstAid />,
		Music: <FaMusic />,
		Refreshments: <FaCoffee />,
	};

	const filteredResults = sortResults(filterResults(results));

	if (!results || results.length === 0) {
		return (
			<div className='text-center py-8'>
				<FaBus className='mx-auto text-6xl text-Darkgreen mb-4' />
				<h3 className='text-xl font-semibold text-Darkgreen mb-2'>
					No buses found for this route
				</h3>
				<p className='text-gray-600'>Try different dates or destinations</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col space-y-6'>
			{/* Results List */}
			<div className='space-y-6'>
				{filteredResults.map((bus) => (
					<motion.div
						key={bus._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'
					>
						{/* Main Content */}
						<div className='p-6'>
							<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
								{/* Bus Info */}
								<div className='flex-1'>
									<div className='flex items-center gap-3 mb-3'>
										<h3 className='text-xl font-bold text-gray-900'>
											{bus.busName ||
												bus.busId?.busName ||
												"Premium Bus Service"}
										</h3>
										<span className='px-3 py-1 text-sm font-semibold text-Darkgreen bg-green-50 rounded-full'>
											{bus.busType ||
												bus.busId?.type ||
												"AC Sleeper"}
										</span>
									</div>

									{/* Seats Available */}
									<div className='flex items-center gap-4 mb-3'>
										<div className='flex items-center text-gray-700'>
											<FaCouch className='text-Darkgreen mr-2' />
											<span className='font-medium'>
												{bus.availableSeats ||
													bus.busId?.availableSeats ||
													0}{" "}
												Seats Available
											</span>
										</div>
										<div className='flex items-center text-gray-700'>
											<FaBus className='text-Darkgreen mr-2' />
											<span className='text-sm'>
												{bus.busNumber ||
													bus.busId?.busNumber ||
													"Bus No. N/A"}
											</span>
										</div>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
										{/* Departure */}
										<div>
											<p className='text-sm text-gray-500 mb-1'>
												Departure
											</p>
											<p className='text-lg font-semibold text-gray-900'>
												{formatTime(bus.departureTime)}
											</p>
											<p className='text-sm text-gray-600 flex items-center mt-1'>
												<FaMapMarkerAlt className='text-Darkgreen mr-1' />
												{bus.source ||
													bus.routeId?.source?.name ||
													"Source N/A"}
											</p>
										</div>

										{/* Duration */}
										<div className='flex flex-col items-center justify-center'>
											<p className='text-sm text-gray-500 mb-1'>
												Duration
											</p>
											<div className='flex items-center'>
												<div className='h-px w-12 bg-gray-300'></div>
												<p className='text-lg font-semibold text-gray-900 mx-3'>
													{calculateDuration(
														bus.departureTime,
														bus.arrivalTime
													)}
												</p>
												<div className='h-px w-12 bg-gray-300'></div>
											</div>
											<p className='text-sm text-gray-600 mt-1 flex items-center'>
												<FaRoute className='text-Darkgreen mr-1' />
												Direct
											</p>
										</div>

										{/* Arrival */}
										<div className='text-right'>
											<p className='text-sm text-gray-500 mb-1'>
												Arrival
											</p>
											<p className='text-lg font-semibold text-gray-900'>
												{formatTime(bus.arrivalTime)}
											</p>
											<p className='text-sm text-gray-600 flex items-center justify-end mt-1'>
												{bus.destination ||
													bus.routeId?.destination?.name ||
													"Destination N/A"}
												<FaMapMarkerAlt className='text-Darkgreen ml-1' />
											</p>
										</div>
									</div>
								</div>

								{/* Price and Booking */}
								<div className='lg:text-right'>
									<p className='text-sm text-gray-500 mb-1'>
										Starting from
									</p>
									<p className='text-3xl font-bold text-Darkgreen mb-3'>
										₹{calculateTotalFare(bus.fareDetails)}
									</p>
									<div className='text-sm text-gray-600 mb-3'>
										{bus.fareDetails?.tax > 0 && (
											<span>
												Includes ₹{bus.fareDetails.tax} tax
											</span>
										)}
									</div>
									<button
										onClick={() => setOpenBus(bus)}
										className='w-full lg:w-auto px-6 py-3 bg-Darkgreen text-white font-semibold rounded-lg
                           hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2'
									>
										View Seats
										<FaChevronRight className='text-sm' />
									</button>
								</div>
							</div>

							{/* Amenities */}
							<div className='mt-6 pt-4 border-t border-gray-100'>
								<div className='flex flex-wrap gap-4'>
									{(bus.amenities || bus.busId?.amenities || []).map(
										(amenity, index) => (
											<div
												key={index}
												className='flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full'
											>
												<span className='text-Darkgreen mr-2'>
													{amenityIcons[
														typeof amenity === "string"
															? amenity
															: amenity.name
													] || <FaCheck />}
												</span>
												<span className='text-sm'>
													{typeof amenity === "string"
														? amenity
														: amenity.name}
												</span>
											</div>
										)
									)}
								</div>
							</div>

							{/* Expand/Collapse Button */}
							<button
								onClick={() => handleExpandClick(bus._id)}
								className='mt-4 text-Darkgreen hover:text-green-700 font-medium text-sm flex items-center gap-1'
							>
								{expandedId === bus._id ? (
									<>
										Less info <FaChevronUp />
									</>
								) : (
									<>
										More info <FaChevronDown />
									</>
								)}
							</button>
						</div>

						{/* Expanded Info */}
						<AnimatePresence>
							{expandedId === bus._id && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									className='border-t border-gray-100 bg-gray-50'
								>
									<div className='p-6 space-y-6'>
										{/* Boarding and Dropping Points */}
										<div className='mt-4 space-y-4'>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												{/* Boarding Points */}
												<div className='bg-gray-50 p-4 rounded-lg'>
													<h4 className='text-lg font-semibold mb-3 flex items-center'>
														<FaMapMarkerAlt className='text-green-600 mr-2' />
														Boarding Points
													</h4>
													<div className='space-y-3'>
														{/* Source as first boarding point */}
														<div className='flex items-start space-x-3'>
															<div className='mt-1'>
																<FaLocationArrow className='text-green-600' />
															</div>
															<div>
																<p className='font-medium'>
																	{bus.routeId?.source?.name}
																</p>
																<p className='text-sm text-gray-600'>
																	{formatTime(
																		bus.departureTime
																	)}
																</p>
															</div>
														</div>
														{/* Via stops as additional boarding points */}
														{bus.routeId?.viaStops?.map(
															(stop, index) => (
																<div
																	key={index}
																	className='flex items-start space-x-3'
																>
																	<div className='mt-1'>
																		<FaRegCompass className='text-blue-500' />
																	</div>
																	<div>
																		<p className='font-medium'>
																			{stop.name}
																		</p>
																		<p className='text-sm text-gray-600'>
																			{stop.arrivalTime}
																		</p>
																	</div>
																</div>
															)
														)}
													</div>
												</div>

												{/* Dropping Points */}
												<div className='bg-gray-50 p-4 rounded-lg'>
													<h4 className='text-lg font-semibold mb-3 flex items-center'>
														<FaMapMarkerAlt className='text-red-600 mr-2' />
														Dropping Points
													</h4>
													<div className='space-y-3'>
														{/* Via stops as dropping points */}
														{bus.routeId?.viaStops?.map(
															(stop, index) => (
																<div
																	key={index}
																	className='flex items-start space-x-3'
																>
																	<div className='mt-1'>
																		<FaRegCompass className='text-blue-500' />
																	</div>
																	<div>
																		<p className='font-medium'>
																			{stop.name}
																		</p>
																		<p className='text-sm text-gray-600'>
																			{stop.departureTime}
																		</p>
																	</div>
																</div>
															)
														)}
														{/* Destination as final dropping point */}
														<div className='flex items-start space-x-3'>
															<div className='mt-1'>
																<FaLocationArrow className='text-red-600' />
															</div>
															<div>
																<p className='font-medium'>
																	{
																		bus.routeId?.destination
																			?.name
																	}
																</p>
																<p className='text-sm text-gray-600'>
																	{formatTime(bus.arrivalTime)}
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Bus Features and Policies */}
										<div className='grid md:grid-cols-2 gap-6'>
											{/* Features */}
											<div>
												<h4 className='text-base font-semibold text-gray-900 mb-4 flex items-center'>
													<FaBus className='text-Darkgreen mr-2' />
													Bus Features
												</h4>
												<div className='grid grid-cols-2 gap-3'>
													{[
														{
															icon: <FaCouch />,
															label: `${
																bus.availableSeats || 0
															} Seats Available`,
														},
														{
															icon: <FaSnowflake />,
															label:
																bus.busId?.type || "Type N/A",
														},
														{
															icon: <FaRoute />,
															label: "Live Tracking Available",
														},
														{
															icon: <FaShieldAlt />,
															label: "Safety Measures",
														},
													].map((feature, index) => (
														<div
															key={index}
															className='flex items-center space-x-2 text-gray-700'
														>
															<span className='text-Darkgreen'>
																{feature.icon}
															</span>
															<span className='text-sm'>
																{feature.label}
															</span>
														</div>
													))}
												</div>
											</div>

											{/* Policies */}
											<div>
												<h4 className='text-base font-semibold text-gray-900 mb-4 flex items-center'>
													<FaShieldAlt className='text-Darkgreen mr-2' />
													Policies
												</h4>
												<div className='space-y-3'>
													{[
														{
															icon: <FaExchangeAlt />,
															text: "Free cancellation up to 24 hours before departure",
														},
														{
															icon: <FaClock />,
															text: "Guaranteed on-time departure",
														},
														{
															icon: <FaShieldAlt />,
															text: "Safe and secure booking",
														},
													].map((policy, index) => (
														<div
															key={index}
															className='flex items-start space-x-3'
														>
															<span className='text-Darkgreen mt-0.5'>
																{policy.icon}
															</span>
															<span className='text-sm text-gray-600'>
																{policy.text}
															</span>
														</div>
													))}
												</div>
											</div>
										</div>

										{/* Route Information */}
										<div>
											<h4 className='text-base font-semibold text-gray-900 mb-4 flex items-center'>
												<FaRoute className='text-Darkgreen mr-2' />
												Route Information
											</h4>
											<div className='bg-white p-4 rounded-lg shadow-sm'>
												<div className='flex items-center justify-between'>
													<div className='space-y-1'>
														<p className='text-sm text-gray-600'>
															From
														</p>
														<p className='font-medium'>
															{bus.routeId?.source?.name ||
																"Source N/A"}
														</p>
													</div>
													<FaArrowRight className='text-Darkgreen' />
													<div className='space-y-1 text-right'>
														<p className='text-sm text-gray-600'>
															To
														</p>
														<p className='font-medium'>
															{bus.routeId?.destination?.name ||
																"Destination N/A"}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				))}
			</div>
			{/* Seat Drawer */}
			<SeatDrawer
				open={!!openBus}
				bus={openBus}
				onClose={() => setOpenBus(null)}
			/>
		</div>
	);
};

export default SearchResults;
