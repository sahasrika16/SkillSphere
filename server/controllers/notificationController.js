const Notification = require("../models/Notification");

exports.createNotification = async ({
  recipient,
  sender = null,
  type = "system",
  title,
  message,
  link = ""
}) => {
  try {
    if (!recipient || !title || !message) return null;

    return await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link
    });
  } catch (error) {
    console.error("Notification create error:", error.message);
    return null;
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id
    })
      .populate("sender", "name avatar role")
      .sort("-createdAt")
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.status(200).json({
      message: "Notifications fetched successfully",
      unreadCount,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message
    });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.status(200).json({
      message: "All notifications marked as read"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark notifications as read",
      error: error.message
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message
    });
  }
};