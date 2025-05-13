import express from 'express';
import slugify from 'slugify';
import Blog from '../models/Blog.js';
import auth from '../auth.js';

const router = express.Router();

// 获取所有文章列表
router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// 根据 ID 获取文章详情
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog
      ? res.json(blog)
      : res.status(404).json({ message: 'Not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 创建文章（需登录）
router.post('/', auth, async (req, res) => {
  try {
    // 后端兜底：若前端未提供 slug，则根据 title 生成英文 slug
    if (!req.body.slug && req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    // 若 slug 依旧为空或中文，将其删除，或后续再做处理
    if (!req.body.slug || req.body.slug.trim() === '') {
      delete req.body.slug;
    }
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 更新文章（需登录）
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    updated
      ? res.json(updated)
      : res.status(404).json({ message: 'Not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 删除文章（需登录）
router.delete('/:id', auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
