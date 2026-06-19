const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `User connected: ${socket.id}`
    );

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      const room =
        io.sockets.adapter.rooms.get(roomId);

      const participantCount =
        room?.size || 0;

      io.to(roomId).emit(
        "participant-count",
        participantCount
      );

      console.log(
        `${socket.id} joined room ${roomId}`
      );
    });

    socket.on("disconnect", () => {
      console.log(
        `User disconnected: ${socket.id}`
      );
    });
    socket.on(
  "send-message",
  ({ roomId, message }) => {

    io.to(roomId).emit(
      "receive-message",
      {
        message,
      }
    );

  }
);
  });
};

module.exports = socketHandler;