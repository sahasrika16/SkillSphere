const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Gig title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"]
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      required: [true, "Gig description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [2500, "Description cannot exceed 2500 characters"]
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },

    subCategory: {
      type: String,
      trim: true,
      default: ""
    },

    skillsRequired: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (skills) => skills.length > 0,
        message: "At least one skill is required"
      }
    },

    tags: {
      type: [String],
      default: []
    },

    pricingType: {
      type: String,
      enum: ["fixed", "hourly"],
      default: "fixed"
    },

    budget: {
      min: {
        type: Number,
        required: [true, "Minimum budget is required"],
        min: [0, "Minimum budget cannot be negative"]
      },
      max: {
        type: Number,
        required: [true, "Maximum budget is required"],
        min: [0, "Maximum budget cannot be negative"]
      },
      currency: {
        type: String,
        default: "INR"
      }
    },

    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      default: "intermediate"
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"]
    },

    location: {
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "India" },
      remote: { type: Boolean, default: true }
    },

    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },

    attachments: [
      {
        url: String,
        publicId: String,
        fileName: String,
        fileType: String
      }
    ],

status: {
  type: String,
  enum: [
    "open",
    "in_progress",
    "submitted",
    "completed",
    "cancelled"
  ],
  default: "open"
},

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
hiredFreelancer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},


    proposalsCount: {
      type: Number,
      default: 0
    },

    viewsCount: {
      type: Number,
      default: 0
    },

    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isFeatured: {
      type: Boolean,
      default: false
    },

    isReported: {
      type: Boolean,
      default: false
    },

    reportsCount: {
      type: Number,
      default: 0
    },

    isDeleted: {
  type: Boolean,
  default: false
},

isPaid: {
  type: Boolean,
  default: false
},

paymentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Payment",
  default: null
},

paidAt: {
  type: Date,
  default: null
}
},
{ timestamps: true }
);
gigSchema.pre("save", function () {
  if (this.isModified("title")) {
    const random = Math.random().toString(36).substring(2, 8);
    this.slug =
      this.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      random;
  }

  if (this.isModified("skillsRequired")) {
    this.skillsRequired = this.skillsRequired.map((skill) =>
      skill.trim().toLowerCase()
    );
  }

  if (this.isModified("tags")) {
    this.tags = this.tags.map((tag) => tag.trim().toLowerCase());
  }
});

gigSchema.index({
  title: "text",
  description: "text",
  category: "text",
  skillsRequired: "text",
  tags: "text"
});

gigSchema.index({ client: 1, createdAt: -1 });
gigSchema.index({ status: 1, createdAt: -1 });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ "budget.min": 1, "budget.max": 1 });

module.exports = mongoose.model("Gig", gigSchema);