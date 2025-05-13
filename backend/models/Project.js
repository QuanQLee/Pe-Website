// models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  tagline:     String,
  description: String,
  image:       String,              // URL（前端暂时可以传空）
  link:        String,              // GitHub / Demo
  createdAt:   { type: Date, default: Date.now }
});

export default mongoose.model('Project', ProjectSchema);
