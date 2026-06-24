//cretaes express
//register routes
//export
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { routeNotFound,errorHandler } = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  // origin:"http://localhost:5173",
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(helmet());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);

//middlewares
app.use(routeNotFound)
app.use(errorHandler)

module.exports = app;