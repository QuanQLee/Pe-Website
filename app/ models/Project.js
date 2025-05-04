import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  tagline:     String,
  description: String,
  image:       String, // URL
  link:        String, // GitHub / Demo
  createdAt:   { type: Date, default: Date.now }
});

export default mongoose.model('Project', ProjectSchema);
