import express from 'express';
import Project from '../models/Project.js';
import auth from '../auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit } = req.query;
  const query = Project.find().sort({ createdAt: -1 });
  if (limit) query.limit(Number(limit));
  res.json(await query);
});

router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  project
    ? res.json(project)
    : res.status(404).json({ message: 'Not found' });
});

router.post('/', auth, async (req, res) => {
  try {
    const created = await Project.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

router.delete('/:id', auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
