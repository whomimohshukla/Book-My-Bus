

let ioInstance = null;

module.exports = {
 
  init: (httpServer) => {
    if (ioInstance) return ioInstance; // singleton
    const { Server } = require("socket.io");
    ioInstance = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });
    ioInstance.on("connection", (socket) => {
      // Automatically join personal user room if userId provided by auth
      const { userId } = socket.handshake.auth || {};
      if (userId) {
        socket.join(userId.toString());
      }

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
