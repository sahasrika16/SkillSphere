const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    reviewerRole: {
      type: String,
      enum: ["client", "freelancer"],
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"]
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [1200, "Review cannot exceed 1200 characters"],
      default: ""
    },

    communicationRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },

    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },

    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

reviewSchema.index(
  {
    gig: 1,
    reviewer: 1,
    reviewee: 1
  },
  {
    unique: true
  }
);

reviewSchema.index({ reviewee: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);