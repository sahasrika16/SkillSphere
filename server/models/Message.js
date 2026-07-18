const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text"
    },

    text: {
      type: String,
      trim: true,
      maxlength: [3000, "Message cannot exceed 3000 characters"],
      default: ""
    },

    attachments: [
      {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
        fileName: { type: String, default: "" },
        fileType: { type: String, default: "" },
        fileSize: { type: Number, default: 0 }
      }
    ],

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        readAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    isEdited: {
      type: Boolean,
      default: false
    },

    editedAt: {
      type: Date,
      default: null
    },

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isDeletedForEveryone: {
      type: Boolean,
      default: false
    },

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        emoji: {
          type: String,
          default: ""
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, createdAt: -1 });

messageSchema.pre("validate", function () {
  const hasText = this.text && this.text.trim().length > 0;
  const hasAttachments = this.attachments && this.attachments.length > 0;

  if (!hasText && !hasAttachments && this.messageType !== "system") {
    throw new Error("Message text or attachment is required");
  }
});

module.exports = mongoose.model("Message", messageSchema);