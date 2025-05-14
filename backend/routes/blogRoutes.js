// routes/blogRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import slugify from 'slugify';
import Blog from '../models/Blog.js';
import auth from '../auth.js';

const router = express.Router();

// 获取所有文章列表
router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// ——————— 修改下面这一段 ———————
// 原来按 ID 查
// router.get('/:id', async (req, res) => { … })

// 改成既支持 ObjectId，也支持 slug
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  let blog = null;

  // 如果是合法的 ObjectId，优先按 _id 查
  if (mongoose.Types.ObjectId.isValid(key)) {
    blog = await Blog.findById(key);
  }
  // 如果没查到，再按 slug 查
  if (!blog) {
    blog = await Blog.findOne({ slug: key });
  }

  return blog
    ? res.json(blog)
    : res.status(404).json({ message: '文章不存在' });
});

// 创建、更新、删除保持不变…
router.post('/', auth, async (req, res) => { /* … */ });
router.put('/:id', auth, async (req, res) => { /* … */ });
router.delete('/:id', auth, async (req, res) => { /* … */ });

export default router;
