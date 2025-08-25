import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	FaEdit,
	FaTrash,
	FaPlus,
	FaMapMarkerAlt,
	FaClock,
	FaRoute,
} from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../utils/api";

const RouteManagement = () => {
	const [routes, setRoutes] = useState([]);
	const [cities, setCities] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		source: { name: "", state: "", cityId: "" },
		destination: { name: "", state: "", cityId: "" },
		distance: "",
		pricePerKm: "",
		viaStops: [],
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [editingId, setEditingId] = useState(null);

	useEffect(() => {
		fetchRoutes();
		fetchCities();
	}, []);

	const fetchRoutes = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.get("/busTravelRoute/Travelroutes");
			console.log("API Response:", response.data);

			if (Array.isArray(response.data)) {
				setRoutes(response.data);
			} else if (response.data && typeof response.data === "object") {
				setRoutes(response.data.routes || []);
			} else {
				setRoutes([]);
			}
		} catch (err) {
			console.error("Error fetching routes:", err);
			setError(
				"Failed to fetch routes: " +
					(err.response?.data?.message || err.message)
			);
			setRoutes([]);
		} finally {
			setLoading(false);
		}
	};

	const fetchCities = async () => {
		try {
			const response = await api.get("/city/getAllCities");
			if (Array.isArray(response.data)) {
				setCities(response.data);
			} else if (response.data && typeof response.data === "object") {
				setCities(response.data.cities || []);
			} else {
				setCities([]);
			}
		} catch (err) {
			console.error("Failed to fetch cities:", err);
			setCities([]);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError(null);

			// For editing, use the existing cityIds from formData
			const payload = {
				source: editingId
					? formData.source
					: {
							cityId: cities.find(
								(city) => city.name === formData.source.name
							)?._id,
							name: formData.source.name,
							state: formData.source.state,
					  },
				destination: editingId
					? formData.destination
					: {
							cityId: cities.find(
								(city) => city.name === formData.destination.name
							)?._id,
							name: formData.destination.name,
							state: formData.destination.state,
					  },
				distance: Number(formData.distance),
				pricePerKm: Number(formData.pricePerKm),
				viaStops: formData.viaStops,
			};

			if (!payload.source.cityId || !payload.destination.cityId) {
				throw new Error("Source or destination city not found");
			}

			if (editingId) {
				await api.put(`/busTravelRoute/Travelroutes/${editingId}`, payload);
			} else {
				await api.post("/busTravelRoute/Travelroutes", payload);
			}

			await fetchRoutes();
			setShowForm(false);
			setFormData({
				source: { name: "", state: "", cityId: "" },
				destination: { name: "", state: "", cityId: "" },
				distance: "",
				pricePerKm: "",
				viaStops: [],
			});
			setEditingId(null);
		} catch (err) {
			const errorMessage = err.response?.data?.message || err.message;
			setError(
				`Failed to ${
					editingId ? "update" : "create"
				} route: ${errorMessage}`
			);
			console.error("Submit error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (
			!id ||
			!window.confirm("Are you sure you want to delete this route?")
		) {
			return;
		}

		try {
			setLoading(true);
			setError(null);
			await api.delete(`/busTravelRoute/Travelroutes/${id}`);
			await fetchRoutes();
		} catch (err) {
			setError(
				"Failed to delete route: " +
					(err.response?.data?.message || err.message)
			);
			console.error("Delete error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (route) => {
		if (!route || !route._id) {
			console.error("Invalid route data for editing");
			return;
		}

		// Set form data with complete route information
		setFormData({
			source: {
				name: route.source.name,
				state: route.source.state,
				cityId: route.source.cityId,
			},
			destination: {
				name: route.destination.name,
				state: route.destination.state,
				cityId: route.destination.cityId,
			},
			distance: route.distance?.toString() || "",
			pricePerKm: route.pricePerKm?.toString() || "",
			viaStops: route.viaStops || [],
		});
		setEditingId(route._id);
		setShowForm(true);
	};

	// Add a new via stop
	const addViaStop = () => {
		setFormData((prev) => ({
			...prev,
			viaStops: [
				...prev.viaStops,
				{
					cityId: "",
					name: "",
					arrivalTime: "",
					departureTime: "",
					stopDuration: 0,
				},
			],
		}));
	};

	// Remove a via stop
	const removeViaStop = (index) => {
		setFormData((prev) => ({
			...prev,
			viaStops: prev.viaStops.filter((_, i) => i !== index),
		}));
	};

	// Update via stop details
	const updateViaStop = (index, field, value) => {
		setFormData((prev) => ({
			...prev,
			viaStops: prev.viaStops.map((stop, i) => {
				if (i === index) {
					if (field === "cityId") {
						const selectedCity = cities.find(
							(city) => city._id === value
						);
						return {
							...stop,
							cityId: value,
							name: selectedCity ? selectedCity.name : "",
						};
					}
					return { ...stop, [field]: value };
				}
				return stop;
			}),
		}));
	};

	// Calculate stop duration
	const calculateStopDuration = (arrivalTime, departureTime) => {
		if (!arrivalTime || !departureTime) return 0;
		const arrival = new Date(`2000-01-01T${arrivalTime}`);
		const departure = new Date(`2000-01-01T${departureTime}`);
		return Math.round((departure - arrival) / (1000 * 60)); // Duration in minutes
	};

	if (loading) {
		return <div className='text-center py-4'>Loading...</div>;
	}

	return (
		<div className='min-h-screen bg-gray-50 py-6 mt-20 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				{/* Header Section with Stats */}
				<div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
					<div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
						<div>
							<h1 className='text-3xl font-bold text-[#349E4D] font-poppins'>
								Route Management
							</h1>
							<p className='mt-2 text-sm text-gray-600 font-roboto'>
								Manage your bus routes and stops
							</p>
						</div>
						<button
							onClick={() => setShowForm(!showForm)}
							className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
              font-medium text-white bg-[#349E4D] hover:bg-[#2C8440] hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#349E4D] 
              transition-all duration-300 ease-in-out transform hover:scale-105 font-roboto'
						>
							<FaPlus className='mr-2 -ml-1 h-5 w-5' />
							{showForm ? "Cancel" : "Add New Route"}
						</button>
					</div>
				</div>

				{error && (
					<div
						className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md'
						role='alert'
					>
						<p className='font-bold'>Error</p>
						<p>{error}</p>
					</div>
				)}

				{showForm && (
					<motion.form
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						onSubmit={handleSubmit}
						className='bg-white p-8 rounded-lg shadow-lg space-y-6 border border-gray-200'
					>
						<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
							{editingId ? "Edit Route" : "Add New Route"}
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Source and Destination Fields */}
							<div className='space-y-4'>
								<h3 className='text-lg font-medium text-gray-700'>
									Source Details
								</h3>
								<div className='form-group'>
									<label className='block text-sm font-medium text-gray-700'>
										City
									</label>
									<select
										value={formData.source.cityId}
										onChange={(e) => {
											const city = cities.find(
												(c) => c._id === e.target.value
											);
											setFormData({
												...formData,
												source: {
													name: city?.name || "",
													state: city?.state || "",
													cityId: city?._id || "",
												},
											});
										}}
										className='mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-[#349E4D] focus:ring-[#349E4D] 
                    hover:border-[#349E4D] hover:shadow-md
                    transition-all duration-300 ease-in-out font-roboto'
									>
										<option value=''>Select City</option>
										{cities.map((city) => (
											<option key={city._id} value={city._id}>
												{city.name}, {city.state}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-lg font-medium text-gray-700'>
									Destination Details
								</h3>
								<div className='form-group'>
									<label className='block text-sm font-medium text-gray-700'>
										City
									</label>
									<select
										value={formData.destination.cityId}
										onChange={(e) => {
											const city = cities.find(
												(c) => c._id === e.target.value
											);
											setFormData({
												...formData,
												destination: {
													name: city?.name || "",
													state: city?.state || "",
													cityId: city?._id || "",
												},
											});
										}}
										className='mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-[#349E4D] focus:ring-[#349E4D] 
                    hover:border-[#349E4D] hover:shadow-md
                    transition-all duration-300 ease-in-out font-roboto'
									>
										<option value=''>Select City</option>
										{cities.map((city) => (
											<option key={city._id} value={city._id}>
												{city.name}, {city.state}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Route Details */}
							<div className='form-group'>
								<label className='block text-sm font-medium text-gray-700'>
									Distance (km)
								</label>
								<input
									type='number'
									value={formData.distance}
									onChange={(e) =>
										setFormData({
											...formData,
											distance: e.target.value,
										})
									}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-[#349E4D] focus:ring-[#349E4D] 
                  hover:border-[#349E4D] hover:shadow-md
                  transition-all duration-300 ease-in-out font-roboto'
									required
								/>
							</div>

							<div className='form-group'>
								<label className='block text-sm font-medium text-gray-700'>
									Price per km (₹)
								</label>
								<input
									type='number'
									value={formData.pricePerKm}
									onChange={(e) =>
										setFormData({
											...formData,
											pricePerKm: e.target.value,
										})
									}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-[#349E4D] focus:ring-[#349E4D] 
                  hover:border-[#349E4D] hover:shadow-md
                  transition-all duration-300 ease-in-out font-roboto'
									required
								/>
							</div>
						</div>

						{/* Via Stops Section */}
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<h3 className='text-lg font-medium text-gray-700'>
									Via Stops
								</h3>
								<button
									type='button'
									onClick={addViaStop}
									className='inline-flex items-center px-4 py-2 border border-transparent rounded-md 
                  shadow-sm text-sm font-medium text-white bg-[#349E4D] 
                  hover:bg-[#2C8440] hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#349E4D] 
                  transition-all duration-300 ease-in-out transform hover:scale-105 font-roboto'
								>
									<FaPlus className='mr-2 -ml-1 h-5 w-5' /> Add Stop
								</button>
							</div>

							{formData.viaStops.map((stop, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									className='p-4 border border-gray-200 rounded-lg space-y-4'
								>
									<div className='flex justify-between items-center'>
										<h4 className='font-medium text-gray-700'>
											Stop {index + 1}
										</h4>
										<button
											type='button'
											onClick={() => removeViaStop(index)}
											className='text-red-600 hover:text-red-800'
										>
											<FaTrash />
										</button>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<div className='form-group'>
											<label className='block text-sm font-medium text-gray-700'>
												City
											</label>
											<select
												value={stop.cityId}
												onChange={(e) =>
													updateViaStop(
														index,
														"cityId",
														e.target.value
													)
												}
												className='mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-[#349E4D] focus:ring-[#349E4D] 
                        hover:border-[#349E4D] hover:shadow-md
                        transition-all duration-300 ease-in-out font-roboto'
											>
												<option value=''>Select City</option>
												{cities.map((city) => (
													<option key={city._id} value={city._id}>
														{city.name}, {city.state}
													</option>
												))}
											</select>
										</div>

										<div className='form-group'>
											<label className='block text-sm font-medium text-gray-700'>
												Arrival Time
											</label>
											<input
												type='time'
												value={stop.arrivalTime}
												onChange={(e) => {
													updateViaStop(
														index,
														"arrivalTime",
														e.target.value
													);
													const duration = calculateStopDuration(
														e.target.value,
														stop.departureTime
													);
													updateViaStop(
														index,
														"stopDuration",
														duration
													);
												}}
												className='mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-[#349E4D] focus:ring-[#349E4D] 
                        hover:border-[#349E4D] hover:shadow-md
                        transition-all duration-300 ease-in-out font-roboto'
											/>
										</div>

										<div className='form-group'>
											<label className='block text-sm font-medium text-gray-700'>
												Departure Time
											</label>
											<input
												type='time'
												value={stop.departureTime}
												onChange={(e) => {
													updateViaStop(
														index,
														"departureTime",
														e.target.value
													);
													const duration = calculateStopDuration(
														stop.arrivalTime,
														e.target.value
													);
													updateViaStop(
														index,
														"stopDuration",
														duration
													);
												}}
												className='mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-[#349E4D] focus:ring-[#349E4D] 
                        hover:border-[#349E4D] hover:shadow-md
                        transition-all duration-300 ease-in-out font-roboto'
											/>
										</div>
									</div>

									<div className='text-sm text-gray-600'>
										Stop Duration: {stop.stopDuration} minutes
									</div>
								</motion.div>
							))}
						</div>

						<div className='flex justify-end pt-4'>
							<button
								type='submit'
								className='inline-flex items-center px-6 py-3 border border-transparent rounded-md 
                shadow-sm text-base font-medium text-white bg-[#349E4D] 
                hover:bg-[#2C8440] hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#349E4D] 
                transition-all duration-300 ease-in-out transform hover:scale-105 font-roboto'
								disabled={loading}
							>
								{loading ? (
									<div className='animate-spin rounded-full h-5 w-5 border-t-2 border-white'></div>
								) : (
									<>
										<FaPlus className='mr-2 -ml-1 h-5 w-5' />
										{editingId ? "Update Route" : "Add Route"}
									</>
								)}
							</button>
						</div>
					</motion.form>
				)}

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{routes.map((route) => (
						<motion.div
							key={route._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200'
						>
							<div className='bg-gradient-to-r from-[#349E4D] to-[#2C8440] p-4'>
								<h3 className='text-lg font-semibold text-white font-poppins'>
									{route.source?.name} to {route.destination?.name}
								</h3>
							</div>

							<div className='p-4 space-y-4'>
								<div className='flex items-center gap-2 text-gray-600'>
									<FaMapMarkerAlt className='text-[#349E4D]' />
									<span>Distance: {route.distance} km</span>
								</div>

								<div className='flex items-center gap-2 text-gray-600'>
									<FaRoute className='text-[#349E4D]' />
									<span>Price/km: ₹{route.pricePerKm}</span>
								</div>

								{route.viaStops && route.viaStops.length > 0 && (
									<div className='space-y-2'>
										<h4 className='font-medium text-gray-700'>
											Via Stops:
										</h4>
										{route.viaStops.map((stop, index) => (
											<div
												key={index}
												className='ml-4 text-sm text-gray-600'
											>
												<div className='flex items-center gap-2'>
													<FaMapMarkerAlt className='text-[#349E4D]' />
													<span>{stop.name}</span>
												</div>
												<div className='ml-6 text-xs'>
													<FaClock className='inline mr-1 text-[#349E4D]' />
													{stop.arrivalTime} - {stop.departureTime}
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							<div className='border-t border-gray-200 p-4 flex justify-end gap-2'>
								<button
									onClick={() => handleEdit(route)}
									className='text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg 
                  transition-colors duration-200 flex items-center gap-1 font-roboto'
								>
									<FaEdit className='mr-1' /> Edit
								</button>
								<button
									onClick={() => handleDelete(route._id)}
									className='text-red-600 hover:text-red-800 px-4 py-2 rounded-lg 
                  transition-colors duration-200 flex items-center gap-1 font-roboto'
								>
									<FaTrash className='mr-1' /> Delete
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RouteManagement;
