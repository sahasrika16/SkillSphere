const express = require("express");

const {
  createReview,
  getUserReviews,
  getGigReviews,
  deleteReview
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/*
=========================================
Review Routes
=========================================
*/

// Create Review
router.post("/", protect, createReview);

// Get Reviews of a User
router.get("/user/:userId", getUserReviews);

// Get Reviews of a Gig
router.get("/gig/:gigId", getGigReviews);

// Delete Review
router.delete("/:id", protect, deleteReview);

module.exports = router;