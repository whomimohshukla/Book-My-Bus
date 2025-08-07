import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocketContext = createContext(null);

/**
 * SocketProvider wraps the app and provides a singleton socket.io-client instance.
 * It also wires default listeners for ARRIVAL_NOTICE and DESTINATION_NOTICE.
 */
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect once when component mounts.
    // Socket backend defaults to 8000 (keep in sync with Server index.js)
    const baseURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
    const s = io(baseURL, { transports: ["websocket"] });
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
