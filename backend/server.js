import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes     from './routes/authRoutes.js';
import blogRoutes     from './routes/blogRoutes.js';
import projectRoutes  from './routes/projectRoutes.js';
import messageRoutes  from './routes/messageRoutes.js';

// 文件上传（可选）
import multer from 'multer';

// Load environment variables
dotenv.config();

// Connect to MongoDB
google? // 拆环境
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error', err));

const app = express();

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : '*',
}));

// Body parser\app.use(express.json());

// Static uploads (optional)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
const PORT = parseInt(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
