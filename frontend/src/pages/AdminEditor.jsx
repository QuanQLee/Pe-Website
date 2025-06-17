import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import api from '../api';
console.log('AdminEditor loaded', localStorage.getItem('token'));

const slugify = s => s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export default function AdminEditor() {
  const nav               = useNavigate();
  const { type, id }       = useParams();      // type=blog|project
  const isBlog             = type === 'blog';
  const [form, setForm]    = useState({});
  const [loading, setLoad] = useState(Boolean(id));

  /* ---------- 读取旧数据 ---------- */
  useEffect(() => {
    if (!id) return;
    api.get(`/${type}s/${id}`).then(res => {
      setForm(res.data);
      setLoad(false);
    });
  }, [id, type]);

  /* ---------- 通用输入 ---------- */
  const onInput = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  /* ---------- 保存 ---------- */
  const save = async () => {
    if (isBlog && (!form.title?.trim() || !form.content?.trim()))
      return alert('标题和内容不能为空');
    if (!isBlog && !form.name?.trim())
      return alert('项目名称不能为空');

    const body = { ...form };
    if (isBlog) body.slug = body.slug?.trim() || slugify(body.title);

    const base = `/${type}s`;

    if (id) await api.put(`${base}/${id}`, body);
    else    await api.post(base,      body);

    nav('/admin/dashboard');                          // 返回管理页
  };

  if (loading) return <p className="p-10 text-center text-gray-400">加载中…</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">{id ? '编辑' : '新建'}{isBlog ? '文章' : '项目'}</h2>

      {isBlog ? (
        <>
          <input name="title" value={form.title || ''} onChange={onInput} placeholder="标题" className="input w-full" />
          <input name="slug"  value={form.slug  || ''} onChange={onInput} placeholder="slug (可留空自动生成)" className="input w-full" />
          <input name="summary" value={form.summary || ''} onChange={onInput} placeholder="文章简介" className="input w-full" />
          <input name="tags" value={form.tags || ''} onChange={onInput} placeholder="标签，用逗号分隔" className="input w-full" />
          <input name="coverImg" value={form.coverImg || ''} onChange={onInput} placeholder="封面图片 URL" className="input w-full" />

          <label className="block font-semibold mt-4 mb-1">内容</label>
          <MDEditor
            value={form.content || ''}
            onChange={v => setForm(f => ({ ...f, content: v }))}
            height={300}
          />
        </>
      ) : (
        <>
          <input name="name" value={form.name || ''} onChange={onInput} placeholder="项目名称" className="input w-full" />
          <input name="tagline" value={form.tagline || ''} onChange={onInput} placeholder="一句话简介" className="input w-full" />
          <input name="coverImg" value={form.coverImg || ''} onChange={onInput} placeholder="封面图片 URL" className="input w-full" />
          <input name="link" value={form.link || ''} onChange={onInput} placeholder="项目链接" className="input w-full" />

          <label className="block font-semibold mt-4 mb-1">项目描述</label>
          <MDEditor
            value={form.description || ''}
            onChange={v => setForm(f => ({ ...f, description: v }))}
            height={250}
          />

          <label className="block font-semibold mt-4 mb-1">完成日期</label>
          <input type="date" name="finishedAt" value={form.finishedAt || ''} onChange={onInput} className="input" />
        </>
      )}

      <div className="flex gap-4 pt-4">
        <button className="btn-outline" onClick={() => nav('/admin/dashboard')}>取消</button>
        <button className="btn-primary" onClick={save}>保存</button>
      </div>
    </div>
  );
}
