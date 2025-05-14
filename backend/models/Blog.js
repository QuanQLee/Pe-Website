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

/* 自动生成 / 去重 slug */
BlogSchema.pre('validate', async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // 若 slug 已存在则追加时间戳
  const exists = await mongoose.models.Blog.findOne({ slug: this.slug, _id: { $ne: this._id } });
  if (exists) this.slug += '-' + Date.now();
  next();
});

export default mongoose.model('Blog', BlogSchema);
