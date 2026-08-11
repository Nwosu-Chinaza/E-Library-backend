import multer from "multer";
import path from "path";
import fs from "fs";

const coverDirectory = "uploads/covers";
const documentDirectory = "uploads/documents";

// Create upload directories if they don't exist
fs.mkdirSync(coverDirectory, { recursive: true });
fs.mkdirSync(documentDirectory, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cover") {
      cb(null, coverDirectory);
    } else if (file.fieldname === "document") {
      cb(null, documentDirectory);
    } else {
      cb(new Error("Invalid file field."));
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  // Cover validation
  if (file.fieldname === "cover") {
    const allowedImages = ["image/jpeg", "image/png", "image/webp"];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(new Error("Cover must be a JPG, PNG, or WebP image."));
  }

  // Document validation
  if (file.fieldname === "document") {
    const allowedDocuments = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedDocuments.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(new Error("Only PDF and DOCX files are allowed."));
  }

  // Reject unknown fields
  return cb(new Error("Invalid file field."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export default upload;
