import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../utils/api';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    operatorId: '',
    busType: '',
    totalSeats: '',
    amenities: []
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Define bus types as a constant
  const BUS_TYPES = [
    { value: "AC", label: "AC" },
    { value: "Non-AC", label: "Non-AC" },
    { value: "Sleeper", label: "Sleeper" },
    { value: "Semi-Sleeper", label: "Semi-Sleeper" }
  ];

  // Function to get bus type label
  const getBusTypeLabel = (type) => {
    const busType = BUS_TYPES.find(t => t.value === type);
    return busType ? busType.label : type;
  };

  const availableAmenities = [
    { name: 'WiFi', icon: 'wifi-icon.png', description: 'Free WiFi available' },
    { name: 'Charging Point', icon: 'charging-icon.png', description: 'USB charging points available' },
    { name: 'Water Bottle', icon: 'water-icon.png', description: 'Complimentary water bottle' },
    { name: 'Blanket', icon: 'blanket-icon.png', description: 'Blanket available on request' },
    { name: 'Entertainment System', icon: 'entertainment-icon.png', description: 'Personal entertainment system' }
  ];

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      const amenityExists = currentAmenities.some(a => a.name === amenity.name);
      
      if (amenityExists) {
        return {
          ...prev,
          amenities: currentAmenities.filter(a => a.name !== amenity.name)
        };
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, { ...amenity }]
        };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchBuses();
    fetchOperators();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/busRoute/buses');
      
      // Handle both array and object responses
      const busData = response.data;
      if (Array.isArray(busData)) {
        // Transform the data to ensure operatorId is properly extracted
        const transformedBuses = busData.map(bus => {
          let operatorId = null;
          
          if (bus.operatorId) {
            if (typeof bus.operatorId === 'object') {
              operatorId = bus.operatorId._id;
            } else if (typeof bus.operatorId === 'string') {
              operatorId = bus.operatorId;
            }
          }
          
          const transformed = {
            ...bus,
            operatorId
          };
          return transformed;
        });
        setBuses(transformedBuses);
      } else if (busData && typeof busData === 'object') {
        const buses = busData.buses || [];
        const transformedBuses = buses.map(bus => {
          let operatorId = null;
          
          if (bus.operatorId) {
            if (typeof bus.operatorId === 'object') {
              operatorId = bus.operatorId._id;
            } else if (typeof bus.operatorId === 'string') {
              operatorId = bus.operatorId;
            }
          }
          
          const transformed = {
            ...bus,
            operatorId
          };
          return transformed;
        });
        setBuses(transformedBuses);
      } else {
        setBuses([]);
      }
    } catch (err) {
      setError('Failed to fetch buses: ' + (err.response?.data?.message || err.message));
      console.error('Fetch buses error:', err);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await api.get('/operatorRoute/operator');
      
      const operatorData = response.data;
      if (Array.isArray(operatorData)) {
        const processedOperators = operatorData.map(op => {
          return {
            _id: op._id,
            name: op.name
          };
        });
        setOperators(processedOperators);
      } else if (operatorData && typeof operatorData === 'object') {
        const operatorArray = operatorData.operators || operatorData.data || [];
        const processedOperators = operatorArray.map(op => {
          return {
            _id: op._id,
            name: op.name
          };
        });
        setOperators(processedOperators);
      } else {
        setOperators([]);
      }
    } catch (err) {
      console.error('Failed to fetch operators:', err);
      setOperators([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.busNumber || !formData.busName || !formData.operatorId || !formData.busType || !formData.totalSeats) {
        throw new Error('Please fill in all required fields');
      }

      // Convert totalSeats to number and ensure it's positive
      const totalSeats = parseInt(formData.totalSeats, 10);
      if (isNaN(totalSeats) || totalSeats <= 0) {
        throw new Error('Total seats must be a positive number');
      }

      // Prepare the request data
      const requestData = {
        busNumber: formData.busNumber,
        busName: formData.busName,
        operatorId: formData.operatorId,
        type: formData.busType,
        totalSeats: totalSeats,
        amenities: formData.amenities.map(amenity => ({
          name: amenity.name,
          icon: amenity.icon,
          description: amenity.description
        })),
        seatLayout: {
          rows: Math.ceil(totalSeats / 4),
          columns: 4,
          seats: Array.from({ length: totalSeats }, (_, index) => ({
            seatNumber: `${String.fromCharCode(65 + Math.floor(index / 4))}${(index % 4) + 1}`,
            type: index % 4 === 0 ? 'Window' : index % 4 === 3 ? 'Window' : 'Aisle',
            deck: 'Lower',
            isAvailable: true,
            price: 500
          }))
        }
      };

      // Log the request data for debugging
      console.log('Sending request with data:', JSON.stringify(requestData, null, 2));

      try {
        if (selectedBus) {
          const response = await api.put(`/busRoute/buses/${selectedBus._id}`, requestData);
          console.log('Update response:', response.data);
        } else {
          const response = await api.post('/busRoute/buses', requestData);
          console.log('Create response:', response.data);
        }
        
        await fetchBuses(); // Refresh the list after successful operation
        setShowForm(false);
        setFormData({
          busNumber: '',
          busName: '',
          operatorId: '',
          busType: '',
          totalSeats: '',
          amenities: []
        });
        setSelectedBus(null);
      } catch (err) {
        console.error('API Error:', err.response || err);
        setError(
          err.response?.data?.error || 
          err.response?.data?.message || 
          err.message || 
          'Failed to save bus'
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create bus');
      console.error('Error details:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this bus?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/busRoute/buses/${id}`);
      await fetchBuses(); // Refresh the list after successful deletion
    } catch (err) {
      setError('Failed to delete bus: ' + (err.response?.data?.message || err.message));
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    if (!bus || !bus._id) {
      console.error('Invalid bus data for editing');
      return;
    }

    setFormData({
      busNumber: bus.busNumber || '',
      busName: bus.busName || '',
      operatorId: bus.operatorId || '',
      busType: bus.busType || '',
      totalSeats: bus.totalSeats?.toString() || '',
      amenities: Array.isArray(bus.amenities) ? bus.amenities : []
    });
    setSelectedBus(bus);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bus Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-DarkGreen text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-LightGreen transition-colors"
        >
          <FaPlus /> {showForm ? 'Cancel' : 'Add Bus'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bus Number</label>
              <input
                type="text"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bus Name</label>
              <input
                type="text"
                name="busName"
                value={formData.busName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Operator</label>
              <select
                name="operatorId"
                value={formData.operatorId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              >
                <option value="">Select Operator</option>
                {Array.isArray(operators) && operators.map((operator) => (
                  <option key={operator._id} value={operator._id}>
                    {operator.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bus Type</label>
              <select
                name="busType"
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
              >
                <option value="">Select Bus Type</option>
                {BUS_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-DarkGreen focus:ring-DarkGreen"
                required
                min="1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableAmenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.name}`}
                      checked={formData.amenities?.some(a => a.name === amenity.name)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-gray-300 text-DarkGreen focus:ring-DarkGreen"
                    />
                    <label htmlFor={`amenity-${amenity.name}`} className="text-sm text-gray-700">
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-DarkGreen text-white px-4 py-2 rounded-lg hover:bg-LightGreen transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : selectedBus ? 'Update Bus' : 'Add Bus'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Seats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amenities</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(buses) && buses.length > 0 ? (
              buses.map((bus) => (
                <tr key={bus._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.busNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.busName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      let operatorId = null;
                      if (bus.operatorId) {
                        if (typeof bus.operatorId === 'object' && bus.operatorId._id) {
                          operatorId = bus.operatorId._id;
                        } else if (typeof bus.operatorId === 'string') {
                          operatorId = bus.operatorId;
                        }
                      }

                      const operator = operators.find(op => op._id === operatorId);
                      return operator ? operator.name : 'Unknown Operator';
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getBusTypeLabel(bus.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.totalSeats}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(bus.amenities) && bus.amenities.map((amenity) => (
                        <span
                          key={amenity._id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          title={amenity.description}
                        >
                          {amenity.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(bus)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit className="inline" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bus._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {loading ? 'Loading buses...' : 'No buses found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusManagement;
