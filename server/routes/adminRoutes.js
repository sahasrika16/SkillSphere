const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getUsers,
  getGigs,
  getReviews,
  toggleBanUser,
  deleteUser,
  deleteGig,
  deleteReview,
} = require("../controllers/adminController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", getDashboard);

router.get("/users", getUsers);
router.patch("/users/:id/ban", toggleBanUser);
router.delete("/users/:id", deleteUser);

router.get("/gigs", getGigs);
router.delete("/gigs/:id", deleteGig);

router.get("/reviews", getReviews);
router.delete("/reviews/:id", deleteReview);

module.exports = router;
