const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const path = require("path");
const Student = require("../../models/student");
const Section = require("../../models/section");
const Unit = require("../../models/unit");

// 1. Resolve correct path for service account credentials
const SERVICE_ACCOUNT_PATH = path.resolve(
  __dirname,
  "../../config/service-account.json"
);
// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_PATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Function to share file with service account
async function shareWithServiceAccount(fileId) {
  try {
    const drive = google.drive({ version: "v3", auth });

    // Get service account email from JSON file
    const serviceAccountEmail =
      require("../../config/service-account.json").client_email;

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "user",
        emailAddress: serviceAccountEmail,
      },
    });

    return true;
  } catch (err) {
    console.error("❌ Error sharing file:", err.message);
    return false;
  }
}

// Video streaming endpoint
router.get("/:fileId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const { fileId } = req.params;
    const student = await Student.findOne({ email: decoded.email });
    if (!student) {
      return res.status(404).send("الطالب غير موجود");
    }

    const section = await Section.findOne({ video: fileId });
    if (!section) {
      return res.status(404).send("الفيديو غير موجود");
    }

    const unit = await Unit.findById(section.unit);
    if (!unit) {
      return res.status(404).send("الوحدة غير موجودة");
    }

    const isRegistered = student.myunits.some(
      (studentUnit) => studentUnit.unit === section.unit
    );

    if (!isRegistered) {
      return res
        .status(403)
        .send("غير مصرح لك بمشاهدة هذا الفيديو. يرجى التسجيل في الوحدة أولاً");
    }

    // First ensure the file is shared with service account
    const sharedSuccessfully = await shareWithServiceAccount(fileId);
    if (!sharedSuccessfully) {
      return res.status(500).send("حدث خطأ أثناء مشاركة الملف");
    }

    const drive = google.drive({ version: "v3", auth });
    const clientRange = req.headers.range;

    const driveOptions = {
      fileId,
      alt: "media",
    };

    const headers = clientRange ? { Range: clientRange } : undefined;

    const driveRes = await drive.files.get(driveOptions, {
      responseType: "stream",
      headers,
    });

    const contentLength = driveRes.headers["content-length"];
    const contentRange = driveRes.headers["content-range"];
    const contentType = driveRes.headers["content-type"] || "video/mp4";

    if (clientRange && contentLength && contentRange) {
      // Partial stream response
      res.writeHead(206, {
        "Content-Type": contentType,
        "Content-Length": contentLength,
        "Content-Range": contentRange,
        "Accept-Ranges": "bytes",
      });
    } else {
      // Full stream fallback
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": contentLength || "0",
        "Accept-Ranges": "bytes",
      });
    }

    driveRes.data.pipe(res);
  } catch (err) {
    console.error("❌ Stream error:", err.message);
    res.status(500).send("حدث خطأ أثناء جلب الفيديو");
  }
});

module.exports = router;
