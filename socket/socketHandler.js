const roomUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);



    socket.on("join-room", ({roomId, user}) => {
      socket.join(roomId);

      const room = io.sockets.adapter.rooms.get(roomId);

      const participantCount = room?.size || 0;

      socket.roomId = roomId;

      if (!roomUsers[roomId]) {
        roomUsers[roomId] = [];
      }

      const existingUser = roomUsers[roomId].find(
        (u) => u.socketId === socket.id,
      );

      if (!existingUser) {
        roomUsers[roomId].push({
          socketId: socket.id,
          userId: user._id,
          userName: user.name,
        });
      }

      io.to(roomId).emit(
        "room-users",
        roomUsers[roomId]);

        io.to(roomId).emit(
        "participant-count",
        participantCount,
      );

      console.log(`${socket.id} joined room ${roomId}`);
    });

    

    socket.on("disconnect", () => {
      const roomId = socket.roomId;

  if (roomId && roomUsers[roomId]) {
    roomUsers[roomId] =
      roomUsers[roomId].filter(
        (user) =>
          user.socketId !== socket.id
      );

    io.to(roomId).emit(
      "room-users",
      roomUsers[roomId]
    );
  }

      console.log(`User disconnected: ${socket.id}`);

    });



    socket.on("send-message", ( messageData ) => {
      console.log("backend received", messageData);
      io.to(messageData.roomId).emit("receive-message", 
        messageData
      );
    });


    socket.on(
  "typing",
  ({ roomId, userName }) => {

    socket
      .to(roomId)
      .emit(
        "user-typing",
        userName
      );

  }
);

  });
};

module.exports = socketHandler;
