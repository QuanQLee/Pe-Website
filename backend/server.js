import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN.split(',') }));
app.use(express.json());

/* ---------- 文件上传：保存到 /uploads 并返回 URL ---------- */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({ dest: path.join(__dirname, 'uploads') });
app.post('/api/upload', upload.single('file'), (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- 业务路由 ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

app.listen(process.env.PORT || 4000, () =>
  console.log('Server on', process.env.PORT || 4000));
