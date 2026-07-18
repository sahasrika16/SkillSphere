const Proposal = require("../models/Proposal");
const Gig = require("../models/Gig");
const Conversation = require("../models/Conversation");
const { createNotification } = require("./notificationController");

exports.createProposal = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({
        message: "Only freelancers can send proposals"
      });
    }

    const { gigId, coverLetter, bidAmount, estimatedDays, portfolioLinks } =
      req.body;

    const gig = await Gig.findOne({
      _id: gigId,
      isDeleted: false,
      status: "open"
    });

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found or not open for proposals"
      });
    }

    if (gig.client.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot send a proposal to your own gig"
      });
    }

    const existingProposal = await Proposal.findOne({
      gig: gigId,
      freelancer: req.user._id,
      isDeleted: false
    });

    if (existingProposal) {
      return res.status(409).json({
        message: "You have already sent a proposal for this gig"
      });
    }

    const proposal = await Proposal.create({
      gig: gigId,
      freelancer: req.user._id,
      client: gig.client,
      coverLetter,
      bidAmount,
      estimatedDays,
      portfolioLinks
    });

    gig.proposalsCount += 1;
    await gig.save();

    await createNotification({
      recipient: gig.client,
      sender: req.user._id,
      type: "proposal_received",
      title: "New Proposal Received",
      message: `${req.user.name || "A freelancer"} sent a proposal for "${gig.title}".`,
      link: `/gigs/${gig._id}/proposals`
    });

    res.status(201).json({
      message: "Proposal sent successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send proposal",
      error: error.message
    });
  }
};

exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancer: req.user._id,
      isDeleted: false
    })
      .populate("gig", "title slug category budget deadline status")
      .populate("client", "name email avatar location rating")
      .sort("-createdAt");

    res.status(200).json({
      message: "My proposals fetched successfully",
      count: proposals.length,
      proposals
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch proposals",
      error: error.message
    });
  }
};

exports.getGigProposals = async (req, res) => {
  try {
    const gig = await Gig.findOne({
      _id: req.params.gigId,
      isDeleted: false
    });

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    if (
      gig.client.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can view proposals only for your own gig"
      });
    }

    const proposals = await Proposal.find({
      gig: req.params.gigId,
      isDeleted: false
    })
      .populate(
        "freelancer",
        "name email avatar location skills rating totalReviews"
      )
      .sort("-createdAt");

    res.status(200).json({
      message: "Gig proposals fetched successfully",
      count: proposals.length,
      proposals
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gig proposals",
      error: error.message
    });
  }
};

exports.updateProposalStatus = async (req, res) => {
  try {
    const { status, clientNote } = req.body;

    const allowedStatuses = ["shortlisted", "accepted", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid proposal status"
      });
    }

    const proposal = await Proposal.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate("gig");

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }

    if (
      proposal.client.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Only the gig owner can update proposal status"
      });
    }

    proposal.status = status;
    proposal.clientNote = clientNote || proposal.clientNote;
    await proposal.save();

    let conversation = null;

    if (status === "accepted") {

  proposal.status = "accepted";
  proposal.clientNote = clientNote || proposal.clientNote;
  await proposal.save();

  const gig = await Gig.findById(proposal.gig._id);

  gig.status = "in_progress";
  gig.projectStatus = "in_progress";
  gig.hiredFreelancer = proposal.freelancer;

  await gig.save();

  // Reject every other proposal
  await Proposal.updateMany(
    {
      gig: gig._id,
      _id: { $ne: proposal._id },
      status: { $in: ["pending", "shortlisted"] }
    },
    {
      status: "rejected"
    }
  );

  // Create conversation if it doesn't exist
  conversation = await Conversation.findOne({
    gig: gig._id,
    client: gig.client,
    freelancer: proposal.freelancer
  });

  if (!conversation) {
    conversation = await Conversation.create({
      gig: gig._id,
      client: gig.client,
      freelancer: proposal.freelancer
    });
  }

  await createNotification({
    recipient: proposal.freelancer,
    sender: req.user._id,
    type: "proposal_accepted",
    title: "Proposal Accepted",
    message: `Your proposal for "${gig.title}" was accepted.`,
    link: "/messages"
  });
}

    if (status === "rejected") {
      await createNotification({
        recipient: proposal.freelancer,
        sender: req.user._id,
        type: "system",
        title: "Proposal Rejected",
        message: `Your proposal for "${proposal.gig.title}" was rejected.`,
        link: "/my-proposals"
      });
    }

    if (status === "shortlisted") {
      await createNotification({
        recipient: proposal.freelancer,
        sender: req.user._id,
        type: "system",
        title: "Proposal Shortlisted",
        message: `Your proposal for "${proposal.gig.title}" was shortlisted.`,
        link: "/my-proposals"
      });
    }

    res.status(200).json({
      message: `Proposal ${status} successfully`,
      proposal,
      conversation
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update proposal",
      error: error.message
    });
  }
};

exports.withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id,
      freelancer: req.user._id,
      isDeleted: false
    });

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }

    if (proposal.status === "accepted") {
      return res.status(400).json({
        message: "Accepted proposal cannot be withdrawn"
      });
    }

    proposal.status = "withdrawn";
    await proposal.save();

    res.status(200).json({
      message: "Proposal withdrawn successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to withdraw proposal",
      error: error.message
    });
  }
};
exports.submitWork = async (req, res) => {
  try {
    const { deliveryMessage, deliveryLink } = req.body;

    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }

    // Only the freelancer who owns the proposal can submit work
    if (
      proposal.freelancer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    proposal.deliveryMessage = deliveryMessage;
    proposal.deliveryLink = deliveryLink;
    proposal.submittedAt = new Date();
    proposal.status = "accepted";

    await proposal.save();

   await Gig.findByIdAndUpdate(
  proposal.gig,
  {
    status: "submitted",
    projectStatus: "submitted"
  }
);

    res.status(200).json({
      message: "Work submitted successfully",
      proposal
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};