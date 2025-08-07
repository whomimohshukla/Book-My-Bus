// Centralized Socket.IO helper
// Usage: const socket = require('./socket');
//        const io = socket.init(server); // in index.js
//        const io = socket.getIo();      // in controllers/routes

let ioInstance = null;

module.exports = {
  /**
   * Initialize Socket.IO on the provided HTTP server.
   * Should be called once from index.js.
   */
  init: (httpServer) => {
    if (ioInstance) return ioInstance; // singleton
    const { Server } = require("socket.io");
    ioInstance = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });
    return ioInstance;
  },

  /**
   * Get the already-initialized io instance.
   */
  getIo: () => {
    if (!ioInstance) {
      throw new Error("Socket.io not initialized! Call init(server) first.");
    }
    return ioInstance;
  },
};
