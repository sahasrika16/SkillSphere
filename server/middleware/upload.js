const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "skillsphere/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, crop: "limit" }],
    public_id: `${Date.now()}-${file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-")}`,
  }),
});

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Cloudinary does NOT auto-append an extension for resource_type "raw"
    // (it only does that for image/video). Without the extension baked into
    // the public_id, the stored asset has no recognizable file type, which
    // breaks delivery/viewing (e.g. Google Docs Viewer, direct downloads).
    const ext = file.originalname.slice(file.originalname.lastIndexOf("."));
    const baseName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-");

    return {
      folder: "skillsphere/files",
      resource_type: "raw",
      type: "upload",
      access_mode: "public",
      public_id: `${Date.now()}-${baseName}${ext}`,
    };
  },
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "skillsphere/resumes",
    resource_type: "image", // PDFs uploaded as "image" deliver inline; "raw" always forces download
    type: "upload",
    access_mode: "public",
    format: "pdf",
    public_id: `${Date.now()}-${file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-")}`,
  }),
});

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadFile = multer({
  storage: fileStorage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = {
  uploadImage,
  uploadFile,
  uploadResume,
};