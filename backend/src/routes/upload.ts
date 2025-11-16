import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
};

// Upload endpoint
router.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }

      console.log("📤 Uploading file:", req.file.originalname);
      console.log("📦 File size:", req.file.size, "bytes");

      const result = await uploadToCloudinary(req.file.buffer);

      console.log("✅ Upload successful:", result.secure_url);

      res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      res.status(500).json({
        error: "Failed to upload image",
        message: error.message,
      });
    }
  }
);

export default router;
