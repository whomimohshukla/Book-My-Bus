import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000/api';

export const notificationService = {
  // Traffic delay prediction
  async predictTrafficDelay(routeId, busId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/traffic-delay`, {
        params: {
          routeId,
          busId,
          timestamp: new Date().toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic delay prediction:', error);
      return null;
    }
  },

  // Bus arrival prediction
  async predictBusArrival(scheduleId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/bus-arrival`, {
        params: {
          scheduleId,
          currentLocation: 'current_location_coordinates'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bus arrival prediction:', error);
      return null;
    }
  },

  // Weather alerts
  async getWeatherAlerts(routeId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/weather`, {
        params: {
          routeId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return null;
    }
  },

  // Real-time updates subscription
  subscribeToRealTimeUpdates(scheduleId, callback) {
    // Implement WebSocket or Socket.IO connection
    // This will be handled by the backend
    const socket = new WebSocket('ws://localhost:8000/real-time-updates');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.scheduleId === scheduleId) {
        callback(data);
      }
    };

    return socket;
  },

  // Show notification
  showNotification(type, message, severity = 'info') {
    const icons = {
      traffic: '🚗',
      arrival: '⏰',
      weather: '🌧️',
      update: '🔄'
    };

    const notificationIcon = icons[type] || '';
    
    toast[severity](
      `${notificationIcon} ${message}`,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true
      }
    );
  }
};
