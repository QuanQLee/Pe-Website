// 仅修改 <div className="modal-body"> 里面内容即可
<div className="modal-body">
  {type === 'blog' ? (
    <>
      <input name="title" value={form.title || ''} onChange={handleChange} placeholder="输入标题" className="input" />
      <input name="slug" value={form.slug || ''} onChange={handleChange} placeholder="输入 slug (选填)" className="input mt-2" />
      <input name="summary" value={form.summary || ''} onChange={handleChange} placeholder="输入文章简介" className="input mt-2" />
      <input name="tags" value={form.tags || ''} onChange={handleChange} placeholder="输入标签（逗号分隔）" className="input mt-2" />
      <input name="coverImg" value={form.coverImg || ''} onChange={handleChange} placeholder="封面图片地址" className="input mt-2" />
      <input
        name="publishedAt"
        type="datetime-local"
        value={form.publishedAt || ''}
        onChange={handleChange}
        className="input mt-2"
      />
      <textarea name="content" value={form.content || ''} onChange={handleChange} placeholder="输入内容（支持 Markdown）" className="textarea mt-2" rows={6} />
    </>
  ) : (
    <>
      <input name="name" value={form.name || ''} onChange={handleChange} placeholder="输入项目名称" className="input" />
      <input name="tagline" value={form.tagline || ''} onChange={handleChange} placeholder="输入项目简介" className="input mt-2" />
      <input name="coverImg" value={form.coverImg || ''} onChange={handleChange} placeholder="项目封面图片" className="input mt-2" />
      <input name="link" value={form.link || ''} onChange={handleChange} placeholder="项目链接" className="input mt-2" />
      <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="项目描述" className="textarea mt-2" rows={4} />
      <input
        name="finishedAt"
        type="date"
        value={form.finishedAt || ''}
        onChange={handleChange}
        className="input mt-2"
      />
    </>
  )}
</div>
