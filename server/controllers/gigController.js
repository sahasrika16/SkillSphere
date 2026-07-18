const Gig = require("../models/Gig");
const Proposal = require("../models/Proposal");
const { createNotification } = require("./notificationController");

const buildGigQuery = (queryParams) => {
  const {
    search,
    category,
    skills,
    minBudget,
    maxBudget,
    pricingType,
    experienceLevel,
    city,
    remote,
    status
  } = queryParams;

  const query = {
    isDeleted: false,
    visibility: "public",
    status: status || "open"
  };

  if (search) query.$text = { $search: search };
  if (category) query.category = category;

  if (skills) {
    const skillsArray = skills
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean);

    query.skillsRequired = { $in: skillsArray };
  }

  if (minBudget) query["budget.max"] = { $gte: Number(minBudget) };
  if (maxBudget) query["budget.min"] = { $lte: Number(maxBudget) };

  if (pricingType) query.pricingType = pricingType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (city) query["location.city"] = new RegExp(city, "i");
  if (remote !== undefined) query["location.remote"] = remote === "true";

  return query;
};

exports.createGig = async (req, res) => {
  try {
    if (req.user.role !== "client" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only clients can post gigs"
      });
    }

    const gig = await Gig.create({
      ...req.body,
      client: req.user._id
    });

    res.status(201).json({
      message: "Gig created successfully",
      gig
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create gig",
      error: error.message
    });
  }
};

exports.getAllGigs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 9, 1), 30);
    const skip = (page - 1) * limit;

    const query = buildGigQuery(req.query);
    const sortBy = req.query.sort || "-createdAt";

    const [gigs, total] = await Promise.all([
      Gig.find(query)
        .populate("client", "name email profilePic location rating totalReviews")
        .sort(sortBy)
        .skip(skip)
        .limit(limit),

      Gig.countDocuments(query)
    ]);

    res.status(200).json({
      message: "Gigs fetched successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      gigs
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gigs",
      error: error.message
    });
  }
};

exports.getSingleGig = async (req, res) => {
  try {
    const { id } = req.params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const query = isObjectId
      ? { _id: id, isDeleted: false }
      : { slug: id, isDeleted: false };

    const gig = await Gig.findOne(query)
      .populate(
  "client",
  "name email profilePic location rating totalReviews"
)
      .populate(
        "hiredFreelancer",
        "name email"
      )
      .populate("paymentId");
    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    gig.viewsCount += 1;
    await gig.save();

    const submittedProposal = await Proposal.findOne({
      gig: gig._id,
      status: "accepted"
    }).select(
      "deliveryMessage deliveryLink submittedAt freelancer"
    );

    const responseGig = gig.toObject();
const proposals = await Proposal.find({ gig: gig._id })
  .populate("freelancer", "name email profilePicture");

responseGig.proposals = proposals;
    responseGig.submission = submittedProposal;

    res.status(200).json({
      message: "Gig fetched successfully",
      gig: responseGig
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gig",
      error: error.message
    });
  }
};

exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({
      client: req.user._id,
      isDeleted: false
    }).sort("-createdAt");

    res.status(200).json({
      message: "My gigs fetched successfully",
      count: gigs.length,
      gigs
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch my gigs",
      error: error.message
    });
  }
};

exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findOne({
      _id: req.params.id,
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
        message: "You can update only your own gigs"
      });
    }

    const allowedUpdates = [
      "title",
      "description",
      "category",
      "subCategory",
      "skillsRequired",
      "tags",
      "pricingType",
      "budget",
      "experienceLevel",
      "deadline",
      "location",
      "status",
      "visibility"
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        gig[field] = req.body[field];
      }
    });

    await gig.save();

    res.status(200).json({
      message: "Gig updated successfully",
      gig
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update gig",
      error: error.message
    });
  }
};


exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findOne({
      _id: req.params.id,
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
        message: "You can delete only your own gigs"
      });
    }

    gig.isDeleted = true;
    gig.status = "cancelled";

    await gig.save();

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


exports.saveGig = async (req, res) => {
  try {
    const gig = await Gig.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    const userId = req.user._id.toString();

    const alreadySaved = gig.savedBy.some(
      (id) => id.toString() === userId
    );

    if (alreadySaved) {
      gig.savedBy = gig.savedBy.filter(
        (id) => id.toString() !== userId
      );
    } else {
      gig.savedBy.push(req.user._id);
    }

    await gig.save();

    res.status(200).json({
      message: alreadySaved
        ? "Gig removed from saved list"
        : "Gig saved successfully",
      saved: !alreadySaved
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save gig",
      error: error.message
    });
  }
};


exports.completeProject = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    if (
      gig.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only client can complete project"
      });
    }
console.log("Status:", gig.status);
console.log("Project Status:", gig.projectStatus);
console.log("Status:", gig.status);
    if (gig.status !== "submitted") {
      return res.status(400).json({
        message: "Freelancer has not submitted work yet"
      });
    }

    gig.status = "completed";
    gig.projectStatus = "completed";

    await gig.save();

    res.status(200).json({
      message: "Project completed successfully",
      gig
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to complete project",
      error: error.message
    });
  }
};


exports.submitWork = async (req, res) => {
  try {
    const { deliveryMessage, deliveryLink } = req.body;

    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    if (
      !gig.hiredFreelancer ||
      gig.hiredFreelancer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the hired freelancer can submit work"
      });
    }

    const proposal = await Proposal.findOne({
      gig: gig._id,
      freelancer: req.user._id,
      status: "accepted"
    });

    if (!proposal) {
      return res.status(404).json({
        message: "Accepted proposal not found for this gig"
      });
    }

    proposal.deliveryMessage = deliveryMessage;
    proposal.deliveryLink = deliveryLink;
    proposal.submittedAt = new Date();

    await proposal.save();

    gig.status = "submitted";
    gig.projectStatus = "submitted";

    await gig.save();

    await createNotification({
      recipient: gig.client,
      sender: req.user._id,
      type: "system",
      title: "Work Submitted",
      message: `${req.user.name || "The freelancer"} submitted work for "${gig.title}".`,
      link: `/gigs/${gig._id}`
    });

    res.status(200).json({
      message: "Work submitted successfully",
      gig
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit work",
      error: error.message
    });
  }
};