import express from 'express';
import slugify from 'slugify';
import Blog from '../models/Blog.js';
import auth from '../auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

router.get('/:slug', async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  blog ? res.json(blog) : res.status(404).json({ message: 'Not found' });
});

router.post('/', auth, async (req, res) => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:slug', auth, async (req, res) => {
  try {
    const updated = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
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

router.delete('/:slug', auth, async (req, res) => {
  await Blog.findOneAndDelete({ slug: req.params.slug });
  res.status(204).end();
});

export default router;
