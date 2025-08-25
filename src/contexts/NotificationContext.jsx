import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/axiosConfig.js';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSocket } from './SocketProvider.jsx';

dayjs.extend(relativeTime);

export const NotificationCtx = createContext(null);

export function useNotifications() {
  return useContext(NotificationCtx);
}

export default function NotificationProvider({ children }) {
  const socket = useSocket();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const addItem = useCallback((n) => {
    setItems((prev) => [n, ...prev]);
  }, []);

  // socket listener
  useEffect(() => {
    if (!socket) return;
    const handler = (n) => {
      addItem(n);
      toast.custom(
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4 shadow-lg w-80">
          <div className="text-2xl">🚌</div>
          <div>
            <p className="font-semibold text-gray-800">{n.title}</p>
            {n.body && <p className="text-sm text-gray-600">{n.body}</p>}
            <p className="mt-1 text-[10px] text-gray-400">{dayjs(n.createdAt).fromNow()}</p>
          </div>
        </div>
      );
    };
    socket.on('NOTIFICATION', handler);
    return () => socket.off('NOTIFICATION', handler);
  }, [socket, addItem]);

  // initial fetch
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/notifications?limit=20');
        setItems(data);
      } catch (err) {
        console.error('fetch notifications', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('markRead', err);
    }
  };

  const value = { items, loading, markRead };

  return <NotificationCtx.Provider value={value}>{children}</NotificationCtx.Provider>;
}
