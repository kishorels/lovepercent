const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

require('dotenv').config();          // ← loads .env locally; harmless on Render
const app = express();

/* ──────────────────────────────────────────────────────────
   1️⃣  Resolve upload directory – fall back to ./uploads   */
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* ──────────────────────────────────────────────────────────
   2️⃣  Serve static files (your public/index.html & video)  */
app.use(express.static(path.join(__dirname, 'public')));

/* ──────────────────────────────────────────────────────────
   3️⃣  Multer storage config                                */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename   : (req, file, cb) => {
    const unique = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

/* ──────────────────────────────────────────────────────────
   4️⃣  Upload route                                         */
app.post('/upload', upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 }
]), (req, res) => {
  console.log('📸  Photos saved:', req.files);
  res.send(`
    <html><body style="text-align:center;padding-top:50px;">
      <h2>✅ Photos Uploaded Successfully!</h2>
      <a href="/">Go Back</a>
    </body></html>
  `);
});

/* ──────────────────────────────────────────────────────────
   5️⃣  Start server – Render sets PORT in the env           */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
