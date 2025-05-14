import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tagline: {
    type: String,
    trim: true,
  },
  // 可选的外部链接，例如 GitHub 或项目主页
  externalUrl: {
    type: String,
    trim: true,
  },
  // 上传的图片或 PDF 文件 URL
  image: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Project', projectSchema);
