import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// 列表 + 简单分页 + tag 过滤
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const query  = tag ? { tags: tag } : {};
    const blogs  = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 详情
router.get('/:slug', async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  blog ? res.json(blog) : res.status(404).json({ message: 'Not found' });
});

// 新建
router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 更新
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
});

// 删除
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
