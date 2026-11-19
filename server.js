// QuickSell - sell only website (Node.js + Express + MongoDB)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quicksell';

// ---------- 1. Database model (product-oda details) ----------
const Product = mongoose.model('Product', new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true },
  quantity:    { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  location:    { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image:       { type: String },
  sellerName:  { type: String, required: true, trim: true },
  contact:     { type: String, required: true, trim: true },
  createdAt:   { type: Date, default: Date.now }
}));

// ---------- 2. Image upload settings ----------
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) =>
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname).toLowerCase())
  }),
  limits: { fileSize: 2 * 1024 * 1024 },               // max 2 MB
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Image file mattum upload pannunga'))
}).single('image');

// ---------- 3. Middleware ----------
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

// ---------- 4. Routes ----------
// Product add panna (Seller)
app.post('/api/products', (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    try {
      const product = await Product.create({
        ...req.body,
        image: req.file ? '/uploads/' + req.file.filename : ''
      });
      res.status(201).json(product);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
});

// Listed products paaka (User) - search and category filter
app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: safe, $options: 'i' };
    }
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- 5. Start ----------
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('QuickSell running: http://localhost:' + PORT));
  })
  .catch(err => {
    console.error('MongoDB connect aagala. MongoDB service run aagudha nu check pannunga.');
    console.error(err.message);
  });
