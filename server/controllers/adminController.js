const User = require("../models/User");
const Gig = require("../models/Gig");
const Proposal = require("../models/Proposal");
const Review = require("../models/Review");
const Payment = require("../models/Payment");

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalGigs = await Gig.countDocuments();

    const activeProjects = await Gig.countDocuments({
      status: "in_progress"
    });

    const totalReviews = await Review.countDocuments();

    const revenueResult = await Payment.aggregate([
      { $match: { status: "Success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.status(200).json({
      totalUsers,
      totalGigs,
      activeProjects,
      totalReviews,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load users",
      error: error.message
    });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load gigs",
      error: error.message
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewer", "name email")
      .populate("reviewee", "name email")
      .populate("gig", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load reviews",
      error: error.message
    });
  }
};

exports.toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Cannot ban an admin account"
      });
    }

    user.status = user.status === "blocked" ? "active" : "blocked";
    await user.save();

    res.status(200).json({
      message:
        user.status === "blocked"
          ? "User has been banned"
          : "User has been unbanned",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Cannot delete an admin account"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Gig deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete gig",
      error: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    await Review.findByIdAndDelete(req.params.id);

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