

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
    ioInstance.on("connection", (socket) => {
      // Client can join a specific bus room
      socket.on("JOIN_ROOM", (room) => {
        socket.join(room);
      });
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
