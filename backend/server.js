import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes    from './routes/authRoutes.js';
import blogRoutes    from './routes/blogRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load env vars
dotenv.config();

// Check required env
const { MONGODB_URI, CORS_ORIGIN, PORT } = process.env;
if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error', err);
    process.exit(1);
  });

const app = express();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN?.split(',').map(o => o.trim()) || '*',
  credentials: true
}));
app.use(express.json());

// File uploads (optional)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import multer from 'multer';
const upload = multer({ dest: path.join(__dirname, 'uploads') });
app.post('/api/upload', upload.single('file'), (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/blogs',    blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

// Start server
const listenPort = parseInt(PORT) || 4000;
app.listen(listenPort, () => console.log(`Server listening on ${listenPort}`));
