const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
      minlength: [30, "Cover letter must be at least 30 characters"],
      maxlength: [2500, "Cover letter cannot exceed 2500 characters"]
    },

    bidAmount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [1, "Bid amount must be greater than 0"]
    },

    estimatedDays: {
      type: Number,
      required: [true, "Estimated delivery days are required"],
      min: [1, "Estimated days must be at least 1"]
    },

    portfolioLinks: {
      type: [String],
      default: []
    },

    attachments: [
      {
        url: String,
        publicId: String,
        fileName: String,
        fileType: String
      }
    ],

    status: {
      type: String,
      enum: [
        "pending",
        "shortlisted",
        "accepted",
        "rejected",
        "withdrawn"
      ],
      default: "pending"
    },

    clientNote: {
      type: String,
      default: ""
    },

    deliveryMessage: {
      type: String,
      default: ""
    },

    deliveryLink: {
      type: String,
      default: ""
    },

    submittedAt: {
      type: Date,
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

proposalSchema.index({ gig: 1, freelancer: 1 }, { unique: true });
proposalSchema.index({ client: 1, status: 1 });
proposalSchema.index({ freelancer: 1, status: 1 });

module.exports = mongoose.model("Proposal", proposalSchema);