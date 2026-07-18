const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active"
    },

    lastMessage: {
      type: String,
      trim: true,
      default: ""
    },

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    lastMessageAt: {
      type: Date,
      default: Date.now
    },

    unreadCount: {
      client: {
        type: Number,
        default: 0,
        min: 0
      },

      freelancer: {
        type: Number,
        default: 0,
        min: 0
      }
    },

    archivedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isBlocked: {
      type: Boolean,
      default: false
    },

    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/*
----------------------------------------------------
Indexes
----------------------------------------------------
*/

// Only one conversation per Gig + Client + Freelancer
conversationSchema.index(
  {
    gig: 1,
    client: 1,
    freelancer: 1
  },
  {
    unique: true
  }
);

// Fast inbox loading
conversationSchema.index({
  updatedAt: -1
});

// Client inbox
conversationSchema.index({
  client: 1,
  lastMessageAt: -1
});

// Freelancer inbox
conversationSchema.index({
  freelancer: 1,
  lastMessageAt: -1
});

/*
----------------------------------------------------
Virtuals
----------------------------------------------------
*/

conversationSchema.virtual("participants").get(function () {
  return [this.client, this.freelancer];
});

/*
----------------------------------------------------
Methods
----------------------------------------------------
*/

conversationSchema.methods.updateLastMessage = function (
  message,
  senderId
) {
  this.lastMessage = message;
  this.lastMessageSender = senderId;
  this.lastMessageAt = new Date();
};

/*
----------------------------------------------------
Export
----------------------------------------------------
*/

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);