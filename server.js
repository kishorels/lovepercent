require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'couples_photos', // your Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// Upload route
app.post('/upload', upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 }
]), (req, res) => {
  const uploaded = req.files;
  const urls = Object.values(uploaded).map(fileArr => fileArr[0].path);

  console.log("Uploaded URLs:", urls);

  res.send(`
    <html><body style="text-align:center; padding-top:50px;">
      <h2>✅ Photos Uploaded to Cloudinary!</h2>
      ${urls.map(url => `<img src="${url}" width="200"><br>`).join('')}
      <a href="/">Go Back</a>
    </body></html>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
