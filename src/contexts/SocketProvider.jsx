import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
   
   
    const baseURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
    let userId;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload._id || payload.id || payload.userId;
      }
    } catch (_) {}

    const s = io(baseURL, {
      transports: ["websocket"],
      auth: userId ? { userId } : {},
    });
    setSocket(s);

    s.on("connect", () => console.info("🔗 Connected to socket server"));
    s.on("disconnect", () => console.warn("⚠️ Disconnected from socket server"));

    // Notifications
    s.on("ARRIVAL_NOTICE", ({ busId, stopName, time }) => {
      toast.info(`Bus ${busId} arriving at ${stopName} around ${new Date(time).toLocaleTimeString()}`);
    });

    s.on("DESTINATION_NOTICE", ({ busId, time }) => {
      toast.success(`Bus ${busId} reached its destination at ${new Date(time).toLocaleTimeString()}`);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);

  return (
    <SocketContext.Provider value={value}>
      {children}
      {/* Global toast container */}
      <ToastContainer position="top-right" newestOnTop pauseOnFocusLoss draggable pauseOnHover />
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx.socket;
};
