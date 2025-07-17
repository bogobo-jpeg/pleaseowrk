import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure uploads folder exists
const uploadDir = path.resolve('uploads');
import fsSync from 'fs';
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir);
}

// Configure Cloudinary with env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup with size limit
const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      public_id: req.file.originalname,
      overwrite: true,
    });
    await fs.unlink(req.file.path);

    res.json({
      url: result.secure_url,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
