const express = require("express");

const {
  createGig,
  getAllGigs,
  getSingleGig,
  getMyGigs,
  updateGig,
  deleteGig,
  saveGig,
  completeProject,
  submitWork
} = require("../controllers/gigController");



const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllGigs);

router.get("/my-gigs", protect, authorizeRoles("client", "admin"), getMyGigs);

router.post("/", protect, authorizeRoles("client", "admin"), createGig);

router.get("/:id", getSingleGig);

router.patch("/:id", protect, updateGig);

router.delete("/:id", protect, deleteGig);

router.patch(
  "/:id/complete",
  protect,
  authorizeRoles("client"),
  completeProject
);

router.patch(
  "/:id/submit",
  protect,
  authorizeRoles("freelancer"),
  submitWork
);

module.exports = router;
