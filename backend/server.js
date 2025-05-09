import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app   = express();
const PORT  = process.env.PORT || 4000;

// 1) 启用 CORS（允许所有来源；生产可以改成只允许你的 GH-Pages 域名）
app.use(cors());
 // 2) 解析 JSON
app.use(express.json());

// 路由
app.get('/', (_, res) => res.send('Personal-Site API running ✅'));
app.use('/api/blogs',     blogRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/messages',  messageRoutes);
app.use('/api/auth', authRoutes);

// 连接数据库并启动
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✓ MongoDB connected');
    app.listen(PORT, () => console.log(`✓ API listening on ${PORT}`));
  })
  .catch(err => console.error('✗ Mongo error', err));
