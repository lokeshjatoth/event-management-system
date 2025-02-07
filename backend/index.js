import express from "express";
import http from "http"; // Required for socket.io
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import eventRoute from "./routes/event.route.js";
import uploadRoute from "./routes/media.route.js";
import { connectDB } from "./utils/connectDb.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

dotenv.config();

// Initialize Express App
const app = express();
connectDB();

// Middleware

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});

// Attach io instance to app
app.set("io", io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/event", eventRoute);
app.use("/api/v1/upload", uploadRoute);

// Socket.io Connection Handling (ONLY For Events, No DB Logic Here)

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId); // Join a specific event room
    console.log(`User joined event room: ${eventId}`);
  });

  // Handle likes update
  socket.on("updateLikes", ({ eventId, likes }) => {
    // Broadcast the likes update to all clients in the event room
    io.to(eventId).emit("likeUpdate", likes);
  });

  // Handle participants update
  socket.on("updateParticipants", ({ eventId, participants }) => {
    // Broadcast the participants update to all clients in the event room
    io.to(eventId).emit("participantUpdate", participants);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
