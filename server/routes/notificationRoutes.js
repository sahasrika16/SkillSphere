const express = require("express");

const {
  getMyNotifications,
  markAllNotificationsRead,
  deleteNotification
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyNotifications);

router.patch("/read-all", protect, markAllNotificationsRead);

router.delete("/:id", protect, deleteNotification);

module.exports = router;