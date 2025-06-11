const express = require('express');
const multer  = require('multer');
const path = require('path');
const app = express();

// Serve static files like index.html and video
app.use(express.static(path.join(__dirname , 'public')));

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Route to handle photo upload
app.post('/upload', upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 }
]), (req, res) => {
  console.log('Photos saved:', req.files);
  res.send(`
    <html>
      <body style="text-align:center; padding-top:50px;">
        <h2>✅ Photos Uploaded Successfully!</h2>
        <a href="/">Go Back</a>
      </body>
    </html>
  `);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
