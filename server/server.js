const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/upload");
const paymentRoutes = require("./routes/paymentRoutes"); // ADDED
const app = express();

/*
==================================================
Allowed Origins (CORS)
==================================================
Add every frontend origin you actually use here.
Vercel gives every deploy a unique URL, so instead of
hardcoding one, we allow your production domain plus
a pattern that matches ANY of your Vercel previews.
*/

const allowedOrigins = [
  "https://skillsphere-psi-bice.vercel.app", // production
  "http://localhost:5173", // local dev
  "http://localhost:3000", // local dev (alt port)
];

const allowedOriginPatterns = [
  /^https:\/\/skillsphere-.*-sahasrika\.vercel\.app$/, // any Vercel preview deploy for this project
];

const corsOriginCheck = (origin, callback) => {
  // allow requests with no origin (curl, Postman, server-to-server)
  if (!origin) return callback(null, true);

  const isAllowed =
    allowedOrigins.includes(origin) ||
    allowedOriginPatterns.some((pattern) => pattern.test(origin));

  if (isAllowed) {
    callback(null, true);
  } else {
    console.warn("❌ Blocked by CORS:", origin);
    callback(new Error("Not allowed by CORS: " + origin));
  }
};

/*
==================================================
Create HTTP Server
==================================================
*/

const server = http.createServer(app);

/*
==================================================
Socket.IO
==================================================
*/

const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    credentials: true
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(String(userId), socket.id);
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
  console.log("Typing Event");
  console.log(sender);
  console.log(receiver);

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

/*
==================================================
Middlewares
==================================================
*/

app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/*
==================================================
Database Connection
==================================================
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  });

/*
==================================================
API Routes
==================================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes); // ADDED

/*
==================================================
Health Check
==================================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SkillSphere Backend API Running",
    version: "1.0.0"
  });
});

/*
==================================================
404 Handler
==================================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

/*
==================================================
Global Error Handler
==================================================
*/

app.use((err, req, res, next) => {
  console.error("❌", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/*
==================================================
Server
==================================================
*/

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 SkillSphere Server running on http://localhost:${PORT}`);
});

module.exports = { io };
