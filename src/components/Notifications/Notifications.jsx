import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { FaBell, FaCar, FaClock, FaCloudRain, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Notifications = ({ scheduleId, routeId, busId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize notifications when component mounts
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (scheduleId) {
      // Subscribe to real-time updates
      const socket = notificationService.subscribeToRealTimeUpdates(scheduleId, (data) => {
        handleRealTimeUpdate(data);
      });
      setSocket(socket);

      // Cleanup socket on unmount
      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, [scheduleId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Fetch initial notifications
      const [trafficDelay, busArrival, weatherAlerts] = await Promise.all([
        notificationService.predictTrafficDelay(routeId, busId),
        notificationService.predictBusArrival(scheduleId),
        notificationService.getWeatherAlerts(routeId)
      ]);

      // Process notifications
      const processedNotifications = [];
      
      if (trafficDelay?.delay > 0) {
        processedNotifications.push({
          type: 'traffic',
          message: `Expected delay of ${trafficDelay.delay} minutes due to ${trafficDelay.reason}`,
          severity: 'warning'
        });
      }

      if (busArrival?.estimatedTime) {
        processedNotifications.push({
          type: 'arrival',
          message: `Bus estimated to arrive in ${busArrival.estimatedTime} minutes`,
          severity: 'info'
        });
      }

      if (weatherAlerts?.alerts.length > 0) {
        weatherAlerts.alerts.forEach(alert => {
          processedNotifications.push({
            type: 'weather',
            message: alert.message,
            severity: alert.severity
          });
        });
      }

      setNotifications(processedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      notificationService.showNotification('error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRealTimeUpdate = (update) => {
    if (update.type === 'traffic') {
      setNotifications(prev => [
        ...prev,
        {
          type: 'traffic',
          message: `Real-time update: ${update.message}`,
          severity: update.severity || 'info'
        }
      ]);
    } else if (update.type === 'arrival') {
      setNotifications(prev => [
        ...prev,
        {
          type: 'arrival',
          message: `Real-time update: ${update.message}`,
          severity: update.severity || 'info'
        }
      ]);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      traffic: <FaCar className="text-2xl" />,
      arrival: <FaClock className="text-2xl" />,
      weather: <FaCloudRain className="text-2xl" />,
      update: <FaBell className="text-2xl" />
    };
    return icons[type] || <FaBell className="text-2xl" />;
  };

  const getNotificationColor = (severity) => {
    const colors = {
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      success: 'bg-green-500'
    };
    return colors[severity] || 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <FaBell className="mr-2 text-Darkgreen" />
        Real-time Updates
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Darkgreen"></div>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No updates available at the moment
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-3 rounded-lg"
              style={{
                backgroundColor: getNotificationColor(notification.severity),
                color: 'white'
              }}
            >
              {getNotificationIcon(notification.type)}
              <div className="ml-3">
                <p className="font-medium">{notification.message}</p>
                <small className="text-sm opacity-80">
                  {new Date().toLocaleTimeString()}
                </small>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
