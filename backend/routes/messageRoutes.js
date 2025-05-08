import express from 'express';
import Message from '../models/Message.js';
import { sendMail } from '../utils/mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const doc = await Message.create(req.body);

  await sendMail({
    subject: `💌 New message from ${doc.name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${doc.name}</p>
      <p><b>Email:</b> ${doc.email}</p>
      <p><b>Subject:</b> ${doc.subject}</p>
      <pre>${doc.message}</pre>
      <hr><small>${doc.createdAt}</small>
    `
  });

  res.status(201).json({ success: true });
});

export default router;
