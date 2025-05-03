import express from 'express';
import Project from './models/Project.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit } = req.query;
  const query = Project.find().sort({ createdAt: -1 });
  if (limit) query.limit(parseInt(limit));
  res.json(await query);
});

router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  project ? res.json(project) : res.status(404).json({ message: 'Not found' });
});

router.post('/', async (req, res) => {
  res.status(201).json(await Project.create(req.body));
});

router.put('/:id', async (req, res) => {
  res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete('/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
