import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import api from '../api';

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

  // 文件上传，图片或 PDF
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/upload', fd);
      const url = data.url || data;
      if (type === 'blog') {
        // 在文章内容末尾插入 Markdown 图片链接
        setForm((prev) => ({
          ...prev,
          content: (prev.content || '') + `\n\n![](${url})`,
        }));
      } else {
        // 项目端把上传文件链接存到 image 字段
        setForm((prev) => ({ ...prev, image: url }));
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('文件上传失败');
    }
  };

  const handleSave = () => {
    const payload = { ...form };
    if (type === 'blog') {
      if (!payload.title?.trim() || !payload.content?.trim()) {
        alert('标题和内容不能为空');
        return;
      }
      // slug 留空则由后端生成
      if (!payload.slug?.trim()) delete payload.slug;
      else payload.slug = simpleSlugify(payload.slug);
    } else {
      if (!payload.name?.trim()) {
        alert('项目名称不能为空');
        return;
      }
    }
    onSave(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3 className="modal-title">
          {initialForm._id ? '编辑' : '新建'} {type === 'blog' ? '文章' : '项目'}
        </h3>
        <div className="modal-body">
          {type === 'blog' ? (
            <>
              <input
                name="title"
                value={form.title || ''}
                onChange={handleChange}
                placeholder="输入标题"
                className="input"
              />
              <input
                name="slug"
                value={form.slug || ''}
                onChange={handleChange}
                placeholder="自定义 slug (选填)"
                className="input mt-2"
              />
              <textarea
                name="content"
                value={form.content || ''}
                onChange={handleChange}
                placeholder="输入内容"
                className="textarea mt-2"
                rows={6}
              />
              <div className="mt-4">
                <label className="block text-sm mb-1">插入图片 / 文件</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  上传后会自动插入到内容末尾（Markdown 语法）
                </p>
              </div>
            </>
          ) : (
            <>
              <input
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                placeholder="输入项目名称"
                className="input"
              />
              <input
                name="tagline"
                value={form.tagline || ''}
                onChange={handleChange}
                placeholder="输入项目简介"
                className="input mt-2"
              />
              <div className="mt-4">
                <label className="block text-sm mb-1">上传文件 (PDF / 图片)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                {form.image && (
                  <a
                    href={form.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm mt-1 block"
                  >
                    已上传文件：查看
                  </a>
                )}
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn mr-2" onClick={onCancel}>
            取消
          </button>
          <button
            className={clsx('btn btn-primary', {
              'opacity-50 pointer-events-none':
                type === 'blog'
                  ? !form.title?.trim() || !form.content?.trim()
                  : !form.name?.trim(),
            })}
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
