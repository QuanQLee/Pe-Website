import express from 'express';
import Blog from '../models/Blog.js';
import auth from '../auth.js';

const router = express.Router();

/* --------   公共接口：任何人都能 GET  -------- */

// 列表 ?page=&limit=&tag=
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const filter = tag ? { tags: tag } : {};
    const blogs  = await Blog.find(filter)
                             .sort({ createdAt: -1 })
                             .skip((page - 1) * limit)
                             .limit(Number(limit));
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

/* --------   受保护接口：需 Bearer Token -------- */

router.post('/', auth, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
});

router.delete('/:id', auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
