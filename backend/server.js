// server.js

import express from 'express';
import cors from 'cors';
// … 其它 import …

dotenv.config();

const app = express();

// 1️⃣ 禁用 ETag 和 强制前端不缓存
app.set('etag', false);
app.use((req, res, next) => {
  // 告诉浏览器：不要缓存
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// 2️⃣ 一定要先 parse JSON
app.use(express.json());

// 3️⃣ CORS 设置，允许你的 GitHub Pages（或其它前端）调用
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// —— 下面挂载你的路由 ——
// app.use('/api/auth', authRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/messages', messageRoutes);

// … 监听端口 …
