import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import MDEditor from '@uiw/react-md-editor';
import { useDropzone } from 'react-dropzone';
import api from '../api';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

export default function EditModal({ isOpen, onClose, initial={}, type, onSaved }) {
  const isBlog = type === 'blog';
  const [title, setTitle] = useState('');
  const [slug, setSlug]   = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover]     = useState('');

  /* 同步初始值 */
  useEffect(()=>{
    setTitle(initial.title || initial.name || '');
    setSlug(initial.slug || '');
    setContent(initial.content || initial.description || '');
    setCover(initial.coverImage || '');
  }, [initial]);

  /* 图片上传 */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async files => {
      const fd = new FormData();
      fd.append('file', files[0]);
      const { data } = await api.post('/upload', fd);
      setCover(data.url);
    }
  });

  /* 保存 */
  const save = async () => {
    const payload = isBlog
      ? { title, slug, content, coverImage: cover }
      : { name: title, tagline: slug, description: content, coverImage: cover };

    if (initial._id) await api.put(`/${type}s/${initial._id}`, payload);
    else await api.post(`/${type}s`, payload);

    onSaved();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4" data-color-mode="light">
        <Dialog.Title className="text-xl font-bold mb-4">{initial._id ? '编辑' : '新增'} {isBlog?'文章':'项目'}</Dialog.Title>

        {/* 标题与 slug/tagline */}
        <div className="mb-4 space-y-2">
          <input className="w-full border rounded px-3 py-2" placeholder="标题" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder={isBlog?'Slug':'项目副标题'} value={slug} onChange={e=>setSlug(e.target.value)} />
        </div>

        {/* 内容编辑 */}
        {isBlog ? (
          <MDEditor value={content} onChange={setContent} height={300} />
        ) : (
          <textarea className="w-full border rounded px-3 py-2 mb-4" rows={6} value={content} onChange={e=>setContent(e.target.value)} />
        )}

        {/* 封面上传 */}
        <div className="mb-4">
          <div {...getRootProps({ className:'border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-gray-400' })}>
            <input {...getInputProps()} />
            {isDragActive ? '释放以上传' : '点击或拖拽上传封面图片'}
          </div>
          {cover && <img src={cover} alt="cover" className="mt-3 max-h-40 object-cover rounded" />}
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>取消</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={save}>保存</button>
        </div>
      </div>
    </Dialog>
  );
}
