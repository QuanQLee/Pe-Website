import express from 'express';
import Project from '../models/Project.js';
import auth from '../auth.js';

const router = express.Router();

// 列表
router.get('/', async (req, res) => {
  const { limit } = req.query;
  const q = Project.find().sort({ createdAt: -1 });
  if (limit) q.limit(Number(limit));
  res.json(await q);
});

// 详情
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  project
    ? res.json(project)
    : res.status(404).json({ message: 'Not found' });
});

// 创建
router.post('/', auth, async (req, res) => {
  try {
    const p = await Project.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 更新
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
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

// 删除
router.delete('/:id', auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;