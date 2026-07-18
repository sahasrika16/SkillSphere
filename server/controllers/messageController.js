const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Gig = require("../models/Gig");
const Notification = require("../models/Notification");

exports.startConversation = async (req, res) => {
  try {
    const { gigId, freelancerId } = req.body;

    if (!gigId || !freelancerId) {
      return res.status(400).json({
        message: "Gig ID and Freelancer ID are required."
      });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found."
      });
    }

    const isClientOwner = gig.client.toString() === req.user._id.toString();
    const isHiredFreelancer =
      gig.hiredFreelancer?.toString() === req.user._id.toString();

    if (!isClientOwner && !isHiredFreelancer && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to start this conversation."
      });
    }

    let conversation = await Conversation.findOne({
      gig: gigId,
      client: gig.client,
      freelancer: freelancerId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        gig: gigId,
        client: gig.client,
        freelancer: freelancerId
      });
    }

    res.status(200).json({
      message: "Conversation ready.",
      conversation
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to start conversation.",
      error: error.message
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, text } = req.body;

    if (!conversationId || !receiverId || !text?.trim()) {
      return res.status(400).json({
        message: "Conversation ID, receiver ID, and message text are required."
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found."
      });
    }

    const isParticipant =
      conversation.client.toString() === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not part of this conversation."
      });
    }

    const isValidReceiver =
      conversation.client.toString() === receiverId ||
      conversation.freelancer.toString() === receiverId;

    if (!isValidReceiver) {
      return res.status(400).json({
        message: "Receiver is not part of this conversation."
      });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot send a message to yourself."
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      text: text.trim(),
      messageType: "text"
    });

    conversation.updateLastMessage(text.trim(), req.user._id);

    if (receiverId === conversation.client.toString()) {
      conversation.unreadCount.client += 1;
    }

    if (receiverId === conversation.freelancer.toString()) {
      conversation.unreadCount.freelancer += 1;
    }

    await conversation.save();


await Notification.create({
  recipient: receiverId,
  title: "New Message",
  message: `${req.user.name} sent you a message`,
  link: `/messages/${conversationId}`
});
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role");

    res.status(201).json({
      message: "Message sent successfully.",
      data: populatedMessage
    });
  } catch (error) {
  console.log("SEND MESSAGE ERROR");
  console.log(error);

  res.status(500).json({
    message: "Failed to send message.",
    error: error.message
  });
}
};

exports.getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ client: req.user._id }, { freelancer: req.user._id }],
      deletedBy: { $ne: req.user._id }
    })
      .populate("client", "name avatar role")
      .populate("freelancer", "name avatar role")
      .populate("gig", "title status budget")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      message: "Conversations fetched successfully.",
      count: conversations.length,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch conversations.",
      error: error.message
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found."
      });
    }

    const isParticipant =
      conversation.client.toString() === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not part of this conversation."
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
      deletedFor: { $ne: req.user._id },
      isDeletedForEveryone: false
    })
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully.",
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages.",
      error: error.message
    });
  }
};

exports.markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found."
      });
    }

    const isClient = conversation.client.toString() === req.user._id.toString();
    const isFreelancer =
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        message: "You are not part of this conversation."
      });
    }

    if (isClient) {
      conversation.unreadCount.client = 0;
    }

    if (isFreelancer) {
      conversation.unreadCount.freelancer = 0;
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: req.user._id,
        "readBy.user": { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            user: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    await conversation.save();

    res.status(200).json({
      message: "Conversation marked as read."
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark conversation as read.",
      error: error.message
    });
  }
};
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found."
      });
    }

    const isParticipant =
      conversation.client.toString() === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not part of this conversation."
      });
    }

    if (!conversation.deletedBy.some((id) => id.toString() === req.user._id.toString())) {
      conversation.deletedBy.push(req.user._id);
    }

    await conversation.save();

    res.status(200).json({
      message: "Chat deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete chat.",
      error: error.message
    });
  }
};