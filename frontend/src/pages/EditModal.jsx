import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

// 如果不想额外安装 slugify，可用下面这个简易函数生成 slug
const simpleSlugify = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')          // 空格替换为 -
    .replace(/[^a-z0-9-]/g, '');   // 去掉非字符和非数字

function EditModal({ type, initialForm = {}, file, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
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
      // 前端兜底生成 slug，确保合法
      form.slug = form.slug?.trim() || simpleSlugify(form.title);
    } else {
      if (!form.name?.trim()) {
        alert('项目名称不能为空');
        return;
      }
    }
    onSave(form, file);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3 className="modal-title">新建 {type === 'blog' ? '文章' : '项目'}</h3>
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
                placeholder="输入 slug (选填)"
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
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn mr-2" onClick={onCancel}>取消</button>
          <button className={clsx('btn btn-primary', {
            'opacity-50 pointer-events-none':
              (type === 'blog'
                ? !form.title?.trim() || !form.content?.trim()
                : !form.name?.trim()),
          })} onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
