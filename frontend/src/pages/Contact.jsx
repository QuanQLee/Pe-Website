import React, { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/messages', form);
      setStatus('Sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('Error, try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="w-full p-2 border rounded" />
        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full p-2 border rounded" />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="w-full p-2 border rounded" />
        <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Message" className="w-full p-2 border rounded h-40" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}