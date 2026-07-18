const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User Connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online-users", Array.from(onlineUsers.keys()));
      console.log(`User ${userId} joined`);
    });

    socket.on("send-message", (message) => {
      const receiverId =
        message.receiver?._id ||
        message.receiver?.id ||
        message.receiver;

      const receiverSocket = onlineUsers.get(String(receiverId));

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", message);
      }
    });

    socket.on("typing", ({ receiver, sender }) => {
      const receiverSocket = onlineUsers.get(String(receiver));

      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", sender);
      }
    });

    socket.on("stop-typing", ({ receiver, sender }) => {
      const receiverSocket = onlineUsers.get(String(receiver));

      if (receiverSocket) {
        io.to(receiverSocket).emit("stop-typing", sender);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User Disconnected:", socket.id);

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = initializeSocket;