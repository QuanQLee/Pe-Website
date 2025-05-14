// models/Blog.js
import mongoose from 'mongoose';
import slugify   from 'slugify';

const BlogSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true },
  slug:    { type: String, required: true, unique: true,
             match: /^[a-z0-9-]+$/ },
  content: { type: String, required: true },
  summary: String,          // 文章摘要（可选）
  tags:    [String],        // 标签（可选）
  createdAt: { type: Date, default: Date.now }
});

BlogSchema.pre('validate', async function (next) {
  if (!this.slug && this.title) {
    // 先尝试生成英文 slug
    const raw = slugify(this.title, { lower: true, strict: true });
    // 如果 raw 为空，就退而求其次用当前时间戳
    this.slug = raw || Date.now().toString();
  }

  // 再检查一次是否重复，重复就追加时间戳后缀
  const exists = await mongoose.models.Blog.findOne({
    slug: this.slug,
    _id: { $ne: this._id },
  });
  if (exists) {
    this.slug += '-' + Date.now();
  }

  next();
});
