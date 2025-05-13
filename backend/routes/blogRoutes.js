// routes/blogRoutes.js  – 只贴修改过的 create 部分
router.post('/', auth, async (req, res) => {
  try {
    /* 后端兜底：若前端没传 slug，就根据 title 生成 */
    if (!req.body.slug && req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
