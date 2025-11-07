const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folders exist
const resumeDir = path.join(__dirname, "../uploads/resumes");
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "resume") {
      cb(null, resumeDir);
    } else if (file.fieldname === "profilePicture") {
      cb(null, uploadDir);
    } else {
      cb(new Error("Invalid field name"), false);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname) {
    return cb(new Error("Invalid file: missing originalname"), false);
  }

  if (file.fieldname === "resume") {
    // ✅ Allow only PDFs
    return cb(null, file.mimetype === "application/pdf");
  }

  if (file.fieldname === "profilePicture") {
    // ✅ Allow only images
    const ext = path.extname(file.originalname).toLowerCase();
    return cb(null, /jpeg|jpg|png/.test(ext));
  }

  // ❌ Reject any other field
  return cb(new Error("Invalid field name"), false);
};

const uploadCombined = multer({ storage, fileFilter });

module.exports = uploadCombined;
