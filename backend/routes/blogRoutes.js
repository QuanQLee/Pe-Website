// routes/blogRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import slugify from 'slugify';
import Blog from '../models/Blog.js';
import auth from '../auth.js';

const router = express.Router();

// 获取所有文章列表（自动补全 slug 字段，旧数据也能返回 slug）
router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  // 补全 slug（兜底逻辑：没有 slug 时用 slugify(title) 生成）
  const fixed = blogs.map(b => ({
    ...b.toObject(),
    slug: b.slug || slugify(b.title, { lower: true, strict: true })
  }));
  res.json(fixed);
});

// 获取单篇文章（支持 id 或 slug）
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  let blog = null;
  if (mongoose.Types.ObjectId.isValid(key)) {
    blog = await Blog.findById(key);
  }
  if (!blog) {
    blog = await Blog.findOne({ slug: key });
  }
  return blog
    ? res.json(blog)
    : res.status(404).json({ message: '文章不存在' });
});

// 新建文章
router.post('/', auth, async (req, res) => {
  // 自动生成 slug（防呆）
  if (!req.body.slug || !/^[a-z0-9-]+$/.test(req.body.slug)) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }
  const blog = new Blog(req.body);
  await blog.save();
  res.json(blog);
});

// 编辑文章（确保 slug 合规，并打开验证）
router.put('/:id', auth, async (req, res) => {
  // 自动修正非法 slug
  if (!req.body.slug || !/^[a-z0-9-]+$/.test(req.body.slug)) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }
  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true   // 启用 schema 校验
  });
  res.json(updated);
});

// 删除文章
router.delete('/:id', auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
