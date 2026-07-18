const Review = require("../models/Review");
const Gig = require("../models/Gig");
const User = require("../models/User");

const recalculateUserRating = async (userId) => {
  const reviews = await Review.find({
    reviewee: userId,
    isDeleted: false
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (sum, review) => sum + Number(review.rating || 0),
          0
        ) / totalReviews
      : 0;

  await User.findByIdAndUpdate(userId, {
    rating: Number(averageRating.toFixed(1)),
    totalReviews
  });
};
exports.createReview = async (req, res) => {
  try {
    const {
      gigId,
      revieweeId,
      rating,
      comment,
      communicationRating,
      qualityRating,
      deliveryRating
    } = req.body;

    if (!gigId || !revieweeId || !rating) {
      return res.status(400).json({
        message: "Gig, reviewee, and rating are required"
      });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    const isClient = gig.client.toString() === req.user._id.toString();
    const isFreelancer =
      gig.hiredFreelancer?.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You can review only users connected to this gig"
      });
    }

    if (req.user._id.toString() === revieweeId) {
      return res.status(400).json({
        message: "You cannot review yourself"
      });
    }

    const validReviewee =
      gig.client.toString() === revieweeId ||
      gig.hiredFreelancer?.toString() === revieweeId;

    if (!validReviewee) {
      return res.status(400).json({
        message: "Reviewee is not connected to this gig"
      });
    }

    const existingReview = await Review.findOne({
      gig: gigId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      isDeleted: false
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this user for this gig"
      });
    }

    const review = await Review.create({
      gig: gigId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      reviewerRole: req.user.role,
      rating,
      comment,
      communicationRating,
      qualityRating,
      deliveryRating
    });

    await recalculateUserRating(revieweeId);

    const populatedReview = await Review.findById(review._id)
      .populate("reviewer", "name avatar role rating")
      .populate("reviewee", "name avatar role rating")
      .populate("gig", "title status");

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit review",
      error: error.message
    });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewee: req.params.userId,
      isDeleted: false
    })
      .populate("reviewer", "name avatar role rating")
      .populate("gig", "title category")
      .sort("-createdAt");

    res.status(200).json({
      message: "Reviews fetched successfully",
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
};

exports.getGigReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      gig: req.params.gigId,
      isDeleted: false
    })
      .populate("reviewer", "name avatar role")
      .populate("reviewee", "name avatar role rating")
      .sort("-createdAt");

    res.status(200).json({
      message: "Gig reviews fetched successfully",
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gig reviews",
      error: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (
      review.reviewer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can delete only your own review"
      });
    }

    review.isDeleted = true;
    await review.save();

    await recalculateUserRating(review.reviewee);

    res.status(200).json({
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message
    });
  }
};