const express = require("express");

const {
  createProposal,
  getMyProposals,
  getGigProposals,
  updateProposalStatus,
  withdrawProposal,
  submitWork
} = require("../controllers/proposalController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("freelancer"),
  createProposal
);

router.get(
  "/my-proposals",
  protect,
  authorizeRoles("freelancer", "admin"),
  getMyProposals
);

router.get(
  "/gig/:gigId",
  protect,
  authorizeRoles("client", "admin"),
  getGigProposals
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("client", "admin"),
  updateProposalStatus
);

router.patch(
  "/:id/withdraw",
  protect,
  authorizeRoles("freelancer"),
  withdrawProposal
);

router.patch(
  "/:id/submit",
  protect,
  authorizeRoles("freelancer"),
  submitWork
);

module.exports = router;