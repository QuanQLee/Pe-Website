import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes     from './routes/authRoutes.js';
import blogRoutes     from './routes/blogRoutes.js';
import projectRoutes  from './routes/projectRoutes.js';
import messageRoutes  from './routes/messageRoutes.js';

import multer   from 'multer';
import path     from 'path';
import { fileURLToPath } from 'url';

dotenv.config();                                   // 读取 .env / Railway 变量
mongoose.connect(process.env.MONGODB_URI);

// -------------------- 基础中间件 --------------------
const app = express();

// ❶ 允许前端跨域访问：多个域名可用 逗号 分隔
//    CORS_ORIGIN="https://quanqlee.github.io,https://preview.quanqlee.com"
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : '*',
  // credentials: true,   // 不用带 cookie，就去掉
}));


app.use(express.json());

// -------------------- 文件上传示例 --------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------- 业务路由 --------------------
app.use('/api/auth',     authRoutes);
app.use('/api/blogs',    blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

// -------------------- 启动 --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on ' + PORT));
