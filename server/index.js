const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const http = require("http"); // Import the 'http' module
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Routes
const userLoginCred = require("./routes/user");
const assignmentCred = require("./routes/assignment");
const sessionCrud = require("./routes/session");
const challengeSession = require("./routes/challenge");

// Initialize express
dotenv.config();
app.use(
  cors({
    origin:  "https://findtalent.netlify.app/", // Allow only your Angular frontend
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers if needed
  })
);

app.use(express.static("public"));

// Create HTTP server with the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server and enable CORS for WebSocket
const io = socketIo(server, {
  cors: {
    origin: "https://findtalent.netlify.app/", // Allow only your Angular frontend
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
require("dotenv").config();
// const PORT = 8001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//  `mongodb+srv://vaibhavroman51:roman123@cluster0.ii7ls.mongodb.net/Model?retryWrites=true&w=majority&appName=Cluster0`
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDb is Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDb connection error:", error);
  });

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit an event to the client when the status changes
  socket.on("statusUpdated", (statusData) => {
    console.log("Status updated:", statusData);

    // Broadcast to all clients except the sender
    socket.broadcast.emit("statusChanged", statusData);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Routes
app.use("/", userLoginCred);
app.use("/user", assignmentCred);
app.use("/session", sessionCrud);
app.use("/challenge", challengeSession);

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server started at PORT: ${process.env.PORT}`);
});
