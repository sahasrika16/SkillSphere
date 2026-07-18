const express = require("express");

const {
  startConversation,
  sendMessage,
  getMyConversations,
  getMessages,
  markConversationRead,
  deleteConversation
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/start", protect, startConversation);

router.post("/send", protect, sendMessage);

router.get("/my-chats", protect, getMyConversations);

router.get("/:conversationId", protect, getMessages);

router.patch("/:conversationId/read", protect, markConversationRead);

router.delete("/:conversationId", protect, deleteConversation);

module.exports = router;