import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  slug:      { type: String, unique: true, required: true },
  content:   { type: String, required: true },   // Markdown
  tags:      [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Blog', BlogSchema);
