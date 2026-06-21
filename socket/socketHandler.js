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
      const existingParticipants =
  roomUsers[roomId].filter(
    (u) => u.socketId !== socket.id
  );
  console.log(
  "existing participants",
  existingParticipants
);

socket.emit(
  "existing-participants",
  existingParticipants
);



// Notify existing users that a new user joined
//this is the emit part

  console.log(
  `participant joined ${socket.id}`
);
    socket.to(roomId).emit(
  "participant-joined",
  {
    socketId: socket.id,
    userId: user._id,
    userName: user.name,
  }
);

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
  ({
    targetSocketId,
    offer,
    senderSocketId,
  }) => {

    io.to(targetSocketId).emit(
      "offer",
      {
        offer,
        senderSocketId,
      }
    );

  }
);
//answer
 socket.on(
  "answer",
  ({
    targetSocketId,
    answer,
    senderSocketId,
  }) => {

    io.to(targetSocketId).emit(
      "answer",
      {
        answer,
        senderSocketId,
      }
    );

  }
);


// //ice-candidates
socket.on(
  "ice-candidate",
  ({
    targetSocketId,
    candidate,
    senderSocketId,
  }) => {

    io.to(targetSocketId).emit(
      "ice-candidate",
      {
        candidate,
        senderSocketId,
      }
    );

  }
);



//screen-sharing
socket.on(
  "screen-share-status",
  ({
    roomId,
    isSharing,
    userName,
  }) => {
     console.log(
      "Backend received screen-share-status"
    );

    socket.to(roomId).emit(
      "screen-share-status",
      {
        isSharing,
        userName,
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
