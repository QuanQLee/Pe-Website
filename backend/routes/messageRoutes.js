import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/', async (req, res) => {
  await Message.create(req.body);
  res.status(201).json({ success: true });
});

export default router;
