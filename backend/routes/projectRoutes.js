import express from 'express';
import Project from '../models/Project.js';
import auth from '../auth.js';

const router = express.Router();

/* --------   公共接口   -------- */

// 列表 ?limit=
router.get('/', async (req, res) => {
  const { limit } = req.query;
  const query = Project.find().sort({ createdAt: -1 });
  if (limit) query.limit(Number(limit));
  res.json(await query);
});

// 详情
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  project ? res.json(project) : res.status(404).json({ message: 'Not found' });
});

/* --------   受保护接口   -------- */

router.post('/', auth, async (req, res) => {
  res.status(201).json(await Project.create(req.body));
});

router.put('/:id', auth, async (req, res) => {
  res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete('/:id', auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
