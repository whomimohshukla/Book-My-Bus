import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Paper, Alert, Snackbar } from "@mui/material";
import {
	FaBus,
	FaMapMarkerAlt,
	FaRoute,
	FaUserFriends,
	FaPhoneAlt,
	FaCalendarAlt,
	FaExchangeAlt,
	FaSearch,
	FaTicketAlt,
	FaStar,
	FaShieldAlt,
	FaRegCreditCard,
	FaWifi,
	FaSnowflake,
	FaChargingStation,
	FaToilet,
	FaAward,
	FaFilter,
} from "react-icons/fa";
import { MdEventSeat, MdLocalOffer } from "react-icons/md";
import { BiDrink } from "react-icons/bi";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import Loader from "./Loader";
import { motion } from "framer-motion";
import api from "../utils/api";



const SearchPage = () => {
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState({
		busTypes: [],
		departureTime: [],
		amenities: [],
		priceRange: 5000,
	});
	const [filteredResults, setFilteredResults] = useState([]);
	const [sortBy, setSortBy] = useState("price_low");

	// Fetch all schedules on component mount
	useEffect(() => {
		fetchAllSchedules();
	}, []);

	// Apply filters whenever results or filters change
	useEffect(() => {
		applyFilters();
	}, [results, filters, sortBy]);

	const applyFilters = () => {
		// console.log("Initial Results:", results);
		// console.log("Filters:", filters);
		let filtered = [...results];

		// Apply bus type filter
		if (filters.busTypes.length > 0) {
			filtered = filtered.filter((bus) => {
				const busType = bus.busId?.type || "";
				return filters.busTypes.includes(busType);
			});
		}
		// console.log("Filtered by Bus Type:", filtered);

		// Apply departure time filter
		if (filters.departureTime.length > 0) {
			filtered = filtered.filter((bus) => {
				const hour = new Date(bus.departureTime).getHours();
				return filters.departureTime.some((timeSlot) => {
					switch (timeSlot) {
						case "morning":
							return hour >= 6 && hour < 12;
						case "afternoon":
							return hour >= 12 && hour < 18;
						case "evening":
							return hour >= 18 && hour < 24;
						case "night":
							return hour >= 0 && hour < 6;
						default:
							return false;
					}
				});
			});
		}
		// console.log("Filtered by Departure Time:", filtered);

		// Apply amenities filter
		if (filters.amenities.length > 0) {
			filtered = filtered.filter((bus) =>
				filters.amenities.every((amenity) =>
					bus.busId?.amenities?.includes(amenity)
				)
			);
		}
		// console.log("Filtered by Amenities:", filtered);

		// Apply price range filter
		filtered = filtered.filter((bus) => {
			const totalFare =
				(bus.fareDetails?.baseFare || 0) +
				(bus.fareDetails?.tax || 0) +
				(bus.fareDetails?.serviceFee || 0);
			return totalFare <= filters.priceRange;
		});
		// console.log("Filtered by Price Range:", filtered);

		// Apply sorting
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "price_low":
					const totalFareA =
						(a.fareDetails?.baseFare || 0) +
						(a.fareDetails?.tax || 0) +
						(a.fareDetails?.serviceFee || 0);
					const totalFareB =
						(b.fareDetails?.baseFare || 0) +
						(b.fareDetails?.tax || 0) +
						(b.fareDetails?.serviceFee || 0);
					return totalFareA - totalFareB;
				case "price_high":
					const totalFareC =
						(a.fareDetails?.baseFare || 0) +
						(a.fareDetails?.tax || 0) +
						(a.fareDetails?.serviceFee || 0);
					const totalFareD =
						(b.fareDetails?.baseFare || 0) +
						(b.fareDetails?.tax || 0) +
						(b.fareDetails?.serviceFee || 0);
					return totalFareD - totalFareC;
				case "duration_short":
					return (
						new Date(a.arrivalTime) -
						new Date(a.departureTime) -
						(new Date(b.arrivalTime) - new Date(b.departureTime))
					);
				case "departure_early":
					return new Date(a.departureTime) - new Date(b.departureTime);
				default:
					return 0;
			}
		});

		// console.log("Final Filtered Results:", filtered);
		setFilteredResults(filtered);
	};

	const handleFilterChange = (type, value) => {
		setFilters((prev) => {
			const newFilters = { ...prev };

			switch (type) {
				case "busType":
					if (newFilters.busTypes.includes(value)) {
						newFilters.busTypes = newFilters.busTypes.filter(
							(t) => t !== value
						);
					} else {
						newFilters.busTypes = [...newFilters.busTypes, value];
					}
					break;

				case "departureTime":
					if (newFilters.departureTime.includes(value)) {
						newFilters.departureTime = newFilters.departureTime.filter(
							(t) => t !== value
						);
					} else {
						newFilters.departureTime = [
							...newFilters.departureTime,
							value,
						];
					}
					break;

				case "amenity":
					if (newFilters.amenities.includes(value)) {
						newFilters.amenities = newFilters.amenities.filter(
							(a) => a !== value
						);
					} else {
						newFilters.amenities = [...newFilters.amenities, value];
					}
					break;

				case "priceRange":
					newFilters.priceRange = value;
					break;
			}

			return newFilters;
		});
	};

	const handleSortChange = (event) => {
		setSortBy(event.target.value);
	};

	const resetFilters = () => {
		setFilters({
			busTypes: [],
			departureTime: [],
			amenities: [],
			priceRange: 5000,
		});
		setSortBy("price_low");
	};

	const fetchAllSchedules = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get("/searchBuses/allbuses/all");
			console.log("API Response:", response.data);

			if (response.data && Array.isArray(response.data)) {
				setResults(response.data);
			} else if (response.data && response.data.data) {
				setResults(
					Array.isArray(response.data.data) ? response.data.data : []
				);
			} else {
				setResults([]);
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.response
					? `Server error: ${error.response.status}`
					: error.request
					? "No response from server. Please check your connection."
					: error.message;

			setError(`Failed to fetch bus schedules. ${errorMessage}`);
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = async (formData) => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get("/searchBuses/buses/search", {
				params: formData,
			});

			if (response.data && Array.isArray(response.data)) {
				setResults(response.data);
			} else if (response.data && response.data.data) {
				setResults(
					Array.isArray(response.data.data) ? response.data.data : []
				);
			} else {
				setResults([]);
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.response
					? `Server error: ${error.response.status}`
					: error.request
					? "No response from server. Please check your connection."
					: error.message;

			setError(`Failed to fetch bus data. ${errorMessage}`);
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-white'>
			{/* Hero Section */}
			<div className='relative bg-Darkgreen overflow-hidden mt-16 sm:mt-20 md:mt-24 lg:mt-28'>
				<Container
					maxWidth='xl'
					className='relative py-12 sm:py-16 md:py-20 lg:py-24 px-4'
				>
					<div className='text-center text-white space-y-4 sm:space-y-6 mb-8 sm:mb-12 md:mb-16'>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-2 sm:px-4'
						>
							Book Your Bus Tickets
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className='text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-2 sm:px-4'
						>
							Travel safely and comfortably across India with our premium
							bus services
						</motion.p>
					</div>

					{/* Search Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className='w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-2 sm:px-4'
					>
						<SearchForm onSearch={handleSearch} disabled={loading} />
					</motion.div>
				</Container>
			</div>

			{/* Results or Popular Routes */}
			<Container
				maxWidth='xl'
				className='py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6'
			>
				{loading && (
					<div className='flex justify-center'>
						<Loader />
					</div>
				)}

				{!loading && results.length > 0 && (
					<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
						{/* Filter Sidebar */}
						<div className='lg:col-span-1'>
							<div className='bg-white rounded-xl shadow-lg p-6 sticky top-24'>
								<div className='flex items-center justify-between mb-6'>
									<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
										<FaFilter className='mr-2' /> Filters
									</h3>
									<button
										onClick={resetFilters}
										className='text-sm text-Darkgreen hover:text-green-700 font-medium'
									>
										Reset All
									</button>
								</div>

								{/* Bus Type Filter */}
								<div className='mb-6'>
									<h4 className='text-sm font-semibold text-gray-700 mb-3'>
										Bus Type
									</h4>
									<div className='space-y-2'>
										{[
											"AC Sleeper",
											"Non AC Sleeper",
											"AC Seater",
											"Non AC Seater",
										].map((type) => (
											<label
												key={type}
												className='flex items-center'
											>
												<input
													type='checkbox'
													checked={filters.busTypes.includes(type)}
													onChange={() =>
														handleFilterChange("busType", type)
													}
													className='form-checkbox h-4 w-4 text-Darkgreen rounded border-gray-300 focus:ring-Darkgreen'
												/>
												<span className='ml-2 text-sm text-gray-600'>
													{type}
												</span>
											</label>
										))}
									</div>
								</div>

								{/* Departure Time */}
								<div className='mb-6'>
									<h4 className='text-sm font-semibold text-gray-700 mb-3'>
										Departure Time
									</h4>
									<div className='space-y-2'>
										{[
											{
												label: "Morning (6 AM - 12 PM)",
												value: "morning",
											},
											{
												label: "Afternoon (12 PM - 6 PM)",
												value: "afternoon",
											},
											{
												label: "Evening (6 PM - 12 AM)",
												value: "evening",
											},
											{
												label: "Night (12 AM - 6 AM)",
												value: "night",
											},
										].map((time) => (
											<label
												key={time.value}
												className='flex items-center'
											>
												<input
													type='checkbox'
													checked={filters.departureTime.includes(
														time.value
													)}
													onChange={() =>
														handleFilterChange(
															"departureTime",
															time.value
														)
													}
													className='form-checkbox h-4 w-4 text-Darkgreen rounded border-gray-300 focus:ring-Darkgreen'
												/>
												<span className='ml-2 text-sm text-gray-600'>
													{time.label}
												</span>
											</label>
										))}
									</div>
								</div>

								{/* Amenities */}
								<div className='mb-6'>
									<h4 className='text-sm font-semibold text-gray-700 mb-3'>
										Amenities
									</h4>
									<div className='space-y-2'>
										{[
											{
												icon: <FaWifi className='text-gray-500' />,
												label: "WiFi",
												value: "wifi",
											},
											{
												icon: (
													<FaSnowflake className='text-gray-500' />
												),
												label: "AC",
												value: "ac",
											},
											{
												icon: (
													<FaChargingStation className='text-gray-500' />
												),
												label: "Charging Point",
												value: "charging",
											},
											{
												icon: <BiDrink className='text-gray-500' />,
												label: "Water Bottle",
												value: "water",
											},
											{
												icon: (
													<FaToilet className='text-gray-500' />
												),
												label: "Washroom",
												value: "washroom",
											},
										].map((amenity) => (
											<label
												key={amenity.value}
												className='flex items-center'
											>
												<input
													type='checkbox'
													checked={filters.amenities.includes(
														amenity.value
													)}
													onChange={() =>
														handleFilterChange(
															"amenity",
															amenity.value
														)
													}
													className='form-checkbox h-4 w-4 text-Darkgreen rounded border-gray-300 focus:ring-Darkgreen'
												/>
												<span className='ml-2 flex items-center text-sm text-gray-600'>
													{amenity.icon}
													<span className='ml-2'>
														{amenity.label}
													</span>
												</span>
											</label>
										))}
									</div>
								</div>

								{/* Price Range */}
								<div className='mb-6'>
									<h4 className='text-sm font-semibold text-gray-700 mb-3'>
										Price Range
									</h4>
									<div className='space-y-4'>
										<input
											type='range'
											min='0'
											max='5000'
											step='100'
											value={filters.priceRange}
											onChange={(e) =>
												handleFilterChange(
													"priceRange",
													parseInt(e.target.value)
												)
											}
											className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-Darkgreen'
										/>
										<div className='flex justify-between text-sm text-gray-600'>
											<span>₹0</span>
											<span>₹{filters.priceRange}</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Results Section */}
						<div id='searchResults' className='lg:col-span-3'>
							<div className='flex justify-between items-center mb-6'>
								<h2 className='text-2xl font-bold text-gray-900'>
									Available Buses ({filteredResults.length})
								</h2>
								<div className='flex items-center space-x-4'>
									<select
										className='form-select rounded-lg border-gray-300 text-sm focus:border-Darkgreen focus:ring-Darkgreen'
										value={sortBy}
										onChange={handleSortChange}
									>
										<option value='price_low'>
											Price: Low to High
										</option>
										<option value='price_high'>
											Price: High to Low
										</option>
										<option value='duration_short'>
											Duration: Shortest First
										</option>
										<option value='departure_early'>
											Departure: Earliest First
										</option>
									</select>
								</div>
							</div>
							<div className='space-y-6'>
								<SearchResults results={filteredResults} />
							</div>
						</div>
					</div>
				)}

				{!loading && results.length === 0 && !error && (
					<div className='bg-white rounded-xl p-8 shadow-sm border border-gray-100'>
						<h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
							Popular Routes
						</h3>
						<div className='flex flex-wrap justify-center gap-3 max-w-3xl mx-auto'>
							{[
								"Mumbai → Pune",
								"Delhi → Agra",
								"Bangalore → Mysore",
								"Chennai → Pondicherry",
								"Hyderabad → Vijayawada",
							].map((route, index) => (
								<button
									key={index}
									className='px-6 py-3 bg-gradient-to-r from-green-50 to-white rounded-full
                           text-gray-700 font-medium shadow-sm border border-green-100
                           hover:shadow-md hover:border-green-200 transition-all duration-300'
								>
									{route}
								</button>
							))}
						</div>
					</div>
				)}

				<Snackbar
					open={!!error}
					autoHideDuration={6000}
					onClose={() => setError(null)}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
				>
					<Alert
						severity='error'
						onClose={() => setError(null)}
						sx={{ width: "100%" }}
					>
						{error}
					</Alert>
				</Snackbar>
			</Container>

			{/* Stats Section */}
			<div className='py-12 sm:py-16 md:py-20 lg:py-24 bg-white mt-8 sm:mt-12 md:mt-16'>
				<Container maxWidth='xl'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
					>
						{[
							{
								icon: <FaUserFriends />,
								count: "1M+",
								text: "Happy Travelers",
								subtext: "and counting",
							},
							{
								icon: <FaBus />,
								count: "500+",
								text: "Bus Partners",
								subtext: "trusted operators",
							},
							{
								icon: <FaRoute />,
								count: "2000+",
								text: "Routes",
								subtext: "across India",
							},
							{
								icon: <FaPhoneAlt />,
								count: "24/7",
								text: "Customer Support",
								subtext: "always available",
							},
						].map((stat, index) => (
							<motion.div
								key={index}
								whileHover={{ y: -5 }}
								className='bg-white p-8 rounded-2xl shadow-lg text-center transform transition-all duration-300 hover:shadow-xl border border-green-100'
							>
								<div className='inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-Darkgreen to-LightGreen'>
									<div className='text-2xl text-white'>
										{stat.icon}
									</div>
								</div>
								<div className='text-4xl font-bold text-Darkgreen mb-2'>
									{stat.count}
								</div>
								<div className='text-gray-900 font-medium mb-1'>
									{stat.text}
								</div>
								<div className='text-sm text-gray-600'>
									{stat.subtext}
								</div>
							</motion.div>
						))}
					</motion.div>
				</Container>
			</div>

			{/* Featured Routes Section */}
			<div className='mb-8 sm:mb-12 bg-white rounded-lg shadow-lg p-4 sm:p-6 mx-4 sm:mx-6'>
				<h2 className='text-xl sm:text-2xl font-bold text-Darkgreen mb-4 sm:mb-6 flex items-center'>
					<FaRoute className='mr-2' /> Featured Routes
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
					{[
						{
							from: "Mumbai",
							to: "Pune",
							price: 450,
							duration: "3h 30m",
							image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66",
							discount: "15% OFF",
							frequency: "100+ buses daily",
						},
						{
							from: "Delhi",
							to: "Agra",
							price: 550,
							duration: "4h",
							image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
							discount: "10% OFF",
							frequency: "80+ buses daily",
						},
						{
							from: "Bangalore",
							to: "Mysore",
							price: 350,
							duration: "3h",
							image: "https://images.unsplash.com/photo-1600689520070-bca431b6c1fd",
							discount: "20% OFF",
							frequency: "90+ buses daily",
						},
					].map((route, index) => (
						<div
							key={index}
							className='relative group cursor-pointer rounded-lg overflow-hidden shadow-md'
						>
							<img
								src={route.image}
								alt={`${route.from} to ${route.to}`}
								className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent'>
								<div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
									<div className='flex justify-between items-end'>
										<div>
											<h3 className='text-lg font-semibold'>
												{route.from} → {route.to}
											</h3>
											<p className='text-sm opacity-90'>
												Starting from ₹{route.price}
											</p>
											<div className='flex items-center mt-1 text-xs space-x-2'>
												<span>{route.duration}</span>
												<span>•</span>
												<span>{route.frequency}</span>
											</div>
										</div>
										<div className='bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold'>
											{route.discount}
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Special Offers Section */}
			<div className='mb-8 sm:mb-12 bg-white rounded-lg shadow-lg p-4 sm:p-6 mx-4 sm:mx-6'>
				<h2 className='text-xl sm:text-2xl font-bold text-Darkgreen mb-4 sm:mb-6 flex items-center'>
					<MdLocalOffer className='mr-2' /> Special Offers
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
					{[
						{
							title: "First Trip Discount",
							code: "FIRST500",
							discount: "₹500 OFF",
							maxDiscount: "Up to ₹500",
							validTill: "31 Dec, 2024",
						},
						{
							title: "Student Special",
							code: "STUDENT20",
							discount: "20% OFF",
							maxDiscount: "Up to ₹200",
							validTill: "31 Dec, 2024",
						},
					].map((offer, index) => (
						<div
							key={index}
							className='border border-dashed border-Darkgreen rounded-lg p-4 bg-green-50'
						>
							<div className='flex justify-between items-start'>
								<div>
									<h3 className='font-semibold'>Sanitized Buses</h3>
									<p className='text-sm text-gray-600 mt-1'>
										Use code:{" "}
										<span className='font-mono font-bold'>
											{offer.code}
										</span>
									</p>
									<p className='text-sm text-gray-600 mt-1'>
										{offer.maxDiscount}
									</p>
									<p className='text-xs text-gray-500 mt-2'>
										Valid till {offer.validTill}
									</p>
								</div>
								<div className='text-2xl font-bold text-red-500'>
									{offer.discount}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Bus Amenities Section */}
			<div className='mb-8 sm:mb-12 bg-white rounded-lg shadow-lg p-4 sm:p-6 mx-4 sm:mx-6'>
				<h2 className='text-xl sm:text-2xl font-bold text-Darkgreen mb-4 sm:mb-6 flex items-center'>
					<FaBus className='mr-2' /> Bus Amenities
				</h2>
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'>
					{[
						{ icon: <FaWifi />, name: "Free WiFi" },
						{ icon: <FaSnowflake />, name: "AC" },
						{ icon: <FaChargingStation />, name: "Charging Point" },
						{ icon: <MdEventSeat />, name: "Reclining Seats" },
						{ icon: <BiDrink />, name: "Water Bottle" },
						{ icon: <FaToilet />, name: "Clean Washroom" },
					].map((amenity, index) => (
						<div
							key={index}
							className='flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
						>
							<div className='text-3xl text-Darkgreen mb-2'>
								{amenity.icon}
							</div>
							<span className='text-sm text-gray-700 text-center'>
								{amenity.name}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Safety Measures Section */}
			<div className='mb-8 sm:mb-12 bg-white rounded-lg shadow-lg p-4 sm:p-6 mx-4 sm:mx-6'>
				<h2 className='text-xl sm:text-2xl font-bold text-Darkgreen mb-4 sm:mb-6 flex items-center'>
					<FaShieldAlt className='mr-2' /> Safety First
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
					<div className='flex items-center space-x-4 bg-gray-50 p-4 rounded-lg'>
						<div className='text-3xl text-Darkgreen'>
							<FaShieldAlt />
						</div>
						<div>
							<h3 className='font-semibold'>Sanitized Buses</h3>
							<p className='text-sm text-gray-600 mt-1'>
								Regular sanitization of all buses
							</p>
						</div>
					</div>
					<div className='flex items-center space-x-4 bg-gray-50 p-4 rounded-lg'>
						<div className='text-3xl text-Darkgreen'>
							<FaUserFriends />
						</div>
						<div>
							<h3 className='font-semibold'>Social Distancing</h3>
							<p className='text-sm text-gray-600 mt-1'>
								Maintained seating arrangement
							</p>
						</div>
					</div>
					<div className='flex items-center space-x-4 bg-gray-50 p-4 rounded-lg'>
						<div className='text-3xl text-Darkgreen'>
							<FaTicketAlt />
						</div>
						<div>
							<h3 className='font-semibold'>Contactless Booking</h3>
							<p className='text-sm text-gray-600 mt-1'>
								Online tickets and payments
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Customer Reviews Section */}
			<div className='mb-8 sm:mb-12 bg-white rounded-lg shadow-lg p-4 sm:p-6 mx-4 sm:mx-6'>
				<h2 className='text-xl sm:text-2xl font-bold text-Darkgreen mb-4 sm:mb-6 flex items-center'>
					<FaStar className='mr-2' /> Customer Reviews
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
					{[
						{
							name: "Rajesh Kumar",
							rating: 5,
							comment:
								"Very comfortable journey from Mumbai to Pune. AC was working perfectly and staff was helpful.",
							date: "2 days ago",
							route: "Mumbai to Pune",
							verified: true,
						},
						{
							name: "Priya Sharma",
							rating: 4,
							comment:
								"Good experience with VRL Travels. Bus was clean and on time.",
							date: "1 week ago",
							route: "Bangalore to Chennai",
							verified: true,
						},
						{
							name: "Amit Patel",
							rating: 5,
							comment:
								"Excellent service on Volvo bus. Punctual departure and arrival.",
							date: "3 days ago",
							route: "Delhi to Jaipur",
							verified: true,
						},
					].map((review, index) => (
						<div key={index} className='bg-gray-50 rounded-lg p-4'>
							<div className='flex items-start justify-between mb-3'>
								<div>
									<h3 className='font-semibold text-gray-800'>
										{review.name}
									</h3>
									<p className='text-sm text-gray-600'>
										{review.route}
									</p>
								</div>
								<div className='flex items-center bg-green-100 px-2 py-1 rounded'>
									<FaStar className='text-yellow-500 mr-1' />
									<span className='text-sm font-medium'>
										{review.rating}.0
									</span>
								</div>
							</div>
							<p className='text-gray-700 mb-3'>{review.comment}</p>
							<div className='flex items-center justify-between text-sm text-gray-500'>
								<span>{review.date}</span>
								{review.verified && (
									<span className='flex items-center text-green-600'>
										<FaAward className='mr-1' /> Verified User
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
