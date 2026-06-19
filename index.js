const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(['8.8.8.8', '1.1.1.1']);
const http=require("http")
const { Server } = require("socket.io");
const socketHandler = require(
  "./socket/socketHandler"
);



const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;

const server=http.createServer(app)


server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
// app.listen(PORT, () => {
//   console.log(
//     `Server running on port ${PORT}`
//   );
// });


const io = new Server(server, {
  cors: {
    origin: "*",//set the frontend url later
  },
});
socketHandler(io);

