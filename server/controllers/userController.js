const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Gig = require("../models/Gig");
const Proposal = require("../models/Proposal");
const Review = require("../models/Review");

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const reviews = await Review.find({
      reviewee: userId,
      isDeleted: false
    })
      .populate("reviewer", "name avatar role")
      .populate("gig", "title category")
      .sort("-createdAt")
      .limit(6);

    const stats = {};

    if (user.role === "client") {
      stats.totalGigs = await Gig.countDocuments({
        client: userId,
        isDeleted: false
      });

      stats.activeGigs = await Gig.countDocuments({
        client: userId,
        status: { $in: ["open", "in_progress"] },
        isDeleted: false
      });

      stats.completedProjects = await Gig.countDocuments({
        client: userId,
        status: "completed",
        isDeleted: false
      });

      stats.totalProposalsReceived = await Proposal.countDocuments({
        client: userId,
        isDeleted: false
      });
    }

    if (user.role === "freelancer") {
      stats.totalProposals = await Proposal.countDocuments({
        freelancer: userId,
        isDeleted: false
      });

      stats.acceptedProposals = await Proposal.countDocuments({
        freelancer: userId,
        status: "accepted",
        isDeleted: false
      });

      stats.completedProjects = await Gig.countDocuments({
        hiredFreelancer: userId,
        status: "completed",
        isDeleted: false
      });

      stats.activeProjects = await Gig.countDocuments({
        hiredFreelancer: userId,
        status: "in_progress",
        isDeleted: false
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
      stats,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const reviews = await Review.find({
      reviewee: userId,
      isDeleted: false
    })
      .populate("reviewer", "name avatar role")
      .populate("gig", "title category")
      .sort("-createdAt")
      .limit(6);

    res.status(200).json({
      message: "User profile fetched successfully",
      user,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user profile",
      error: error.message
    });
  }
};
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, bio, skills } = req.body;

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password",
      error: error.message
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};