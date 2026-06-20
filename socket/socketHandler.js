const roomUsers = {};

const socketHandler = (io) => {
  //connection
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);


//join room
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

// Notify existing users that a new user joined
      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        user,
      });


//participant list
      io.to(roomId).emit(
        "room-users",
        roomUsers[roomId]);
//participant count
        io.to(roomId).emit(
        "participant-count",
        participantCount,
      );

      console.log(`${socket.id} joined room ${roomId}`);
    });

    


//chat
    socket.on("send-message", ( messageData ) => {
      console.log("backend received", messageData);
      io.to(messageData.roomId).emit("receive-message", 
        messageData
      );
    });

//typing
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



//webrtc signalling further---

//offer
  socket.on(
      "offer",
      ({ roomId, offer, sender }) => {
        socket.to(roomId).emit(
          "offer",
          {
            offer,
            sender,
          }
        );
      }
    );
//answer
  socket.on(
      "answer",
      ({ roomId, answer, sender }) => {
        socket.to(roomId).emit(
          "answer",
          {
            answer,
            sender,
          }
        );
      }
    );


// //ice-candidates
 socket.on(
      "ice-candidate",
      ({
        roomId,
        candidate,
        sender,
      }) => {
        socket.to(roomId).emit(
          "ice-candidate",
          {
            candidate,
            sender,
          }
        );
      }
    );


    //disconnect
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

    io.to(roomId).emit(
      "participant-count",
      roomUsers[roomId].length
    );
//applicable for upto 3 participants .will have to switch to target socketId for 3+
    socket.to(roomId).emit(
          "user-left",
          {
            socketId: socket.id,
          }
        );



    if (roomUsers[roomId].length === 0) {
      delete roomUsers[roomId];
    }
  }

  console.log(
    `User disconnected: ${socket.id}`
  );
});


  });

  



};

module.exports = socketHandler;
