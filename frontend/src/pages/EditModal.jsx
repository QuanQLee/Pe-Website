import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/dist/mdeditor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";


// 简易 slugify，无需依赖
const simpleSlugify = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export default function EditModal({ type, initialForm = {}, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm || {});

  useEffect(() => {
    setForm(initialForm || {});
  }, [initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (type === 'blog') {
      if (!form.title?.trim() || !form.content?.trim()) {
        alert('标题和内容不能为空');
        return;
      }
      // 生成 slug
      form.slug = form.slug?.trim() || simpleSlugify(form.title);
    } else {
      if (!form.name?.trim()) {
        alert('项目名称不能为空');
        return;
      }
    }
    onSave(form);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{maxWidth:600}}>
        <h3 className="modal-title">
          {initialForm._id ? '编辑' : '新建'} {type === 'blog' ? '文章' : '项目'}
        </h3>
        <div className="modal-body" data-color-mode="light">
          {type === 'blog' ? (
            <>
              <input name="title" value={form.title || ''} onChange={handleChange} placeholder="输入标题" className="input" />
              <input name="slug" value={form.slug || ''} onChange={handleChange} placeholder="输入 slug (选填)" className="input mt-2" />
              <input name="summary" value={form.summary || ''} onChange={handleChange} placeholder="输入文章简介" className="input mt-2" />
              <input name="tags" value={form.tags || ''} onChange={handleChange} placeholder="输入标签（逗号分隔）" className="input mt-2" />
              <input name="coverImg" value={form.coverImg || ''} onChange={handleChange} placeholder="封面图片URL" className="input mt-2" />
              {form.coverImg && (
                <div style={{ margin: '8px 0' }}>
                  <img src={form.coverImg} alt="封面预览" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} />
                </div>
              )}
              <input
                name="publishedAt"
                type="datetime-local"
                value={form.publishedAt || ''}
                onChange={handleChange}
                className="input mt-2"
              />
              <label className="block mt-3 mb-1 font-semibold">内容</label>
              <div data-color-mode="light">
                <MDEditor
                  value={form.content || ""}
                  onChange={v => setForm(f => ({ ...f, content: v || "" }))}
                  height={320}
                  preview="edit"
                />
              </div>
            </>
          ) : (
            <>
              <input name="name" value={form.name || ''} onChange={handleChange} placeholder="输入项目名称" className="input" />
              <input name="tagline" value={form.tagline || ''} onChange={handleChange} placeholder="输入项目简介" className="input mt-2" />
              <input name="coverImg" value={form.coverImg || ''} onChange={handleChange} placeholder="项目封面图片URL" className="input mt-2" />
              {form.coverImg && (
                <div style={{ margin: '8px 0' }}>
                  <img src={form.coverImg} alt="项目封面预览" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} />
                </div>
              )}
              <input name="link" value={form.link || ''} onChange={handleChange} placeholder="项目链接" className="input mt-2" />
              <label className="block mt-3 mb-1 font-semibold">项目描述</label>
              <div data-color-mode="light">
                <MDEditor
                  value={form.description || ""}
                  onChange={v => setForm(f => ({ ...f, description: v || "" }))}
                  height={200}
                  preview="edit"
                />
              </div>
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
        <div className="modal-footer">
          <button className="btn mr-2" onClick={onCancel}>取消</button>
          <button className={clsx('btn btn-primary', { 'opacity-50 pointer-events-none': type === 'blog' ? !form.title?.trim() || !form.content?.trim() : !form.name?.trim() })} onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
}
