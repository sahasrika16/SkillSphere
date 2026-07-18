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
    origin: process.env.CLIENT_URL || "https://skillsphere-pf6v5gnsk-sahasrika.vercel.app",
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
    origin: process.env.CLIENT_URL || "https://skillsphere-pf6v5gnsk-sahasrika.vercel.app",
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