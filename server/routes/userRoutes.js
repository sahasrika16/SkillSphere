const express = require("express");

const {
  getMyProfile,
  getUserProfile,
  updateMyProfile,
  changePassword,
  getAllUsers
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.patch("/me", protect, updateMyProfile);

router.patch("/change-password", protect, changePassword);
router.get("/", protect, getAllUsers);
router.get("/:userId", getUserProfile);

module.exports = router;