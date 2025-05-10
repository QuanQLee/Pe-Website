// src/pages/EditModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useDropzone } from 'react-dropzone';
import api from '../api';

export default function EditModal({
  open = false,          // 一定要布尔
  onClose,
  initial = {},          // 默认空对象避免 undefined
  type,                  // 'blog' or 'project'
  onSaved,               // 保存后回调
}) {
  // 本地表单状态
  const [title, setTitle]     = useState(initial.title || '');
  const [slug, setSlug]       = useState(initial.slug || '');
  const [content, setContent] = useState(initial.content || '');
  const [cover, setCover]     = useState(initial.coverImage || '');

  // 拖拽上传封面
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: files => {
      const file = files[0];
      // 本地预览
      const previewUrl = URL.createObjectURL(file);
      setCover(previewUrl);
      // 上传到后端
      const fd = new FormData();
      fd.append('file', file);
      api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        setCover(res.data.url);
      });
    }
  });

  // 当 initial 改变时，重置表单
  useEffect(() => {
    setTitle(initial.title || '');
    setSlug(initial.slug || '');
    setContent(initial.content || '');
    setCover(initial.coverImage || '');
  }, [initial]);

  const handleSave = async () => {
    const payload = { title, slug, content, coverImage: cover };
    const id = initial._id;
    if (id) {
      await api.put(`/${type}s/${id}`, payload);
    } else {
      await api.post(`/${type}s`, payload);
    }
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />

      <div className="relative bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
        <Dialog.Title className="text-xl font-semibold mb-4">
          {initial._id ? '编辑' : '新增'}{type === 'blog' ? '文章' : '项目'}
        </Dialog.Title>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">标题</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">路径 (slug)</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
          </div>
          {type === 'blog' ? (
            <div data-color-mode="light">
              <label className="block mb-1">内容 (Markdown)</label>
              <MDEditor height={300} value={content} onChange={setContent} />
            </div>
          ) : (
            <div>
              <label className="block mb-1">简介</label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                rows={5}
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block mb-1">封面图</label>
            <div
              {...getRootProps()}
              className="border border-dashed rounded p-4 text-center cursor-pointer hover:border-gray-400"
            >
              <input {...getInputProps()} />
              {isDragActive ? '释放以上传' : '点击或拖拽图片此处'}
            </div>
            {cover && (
              <img
                src={cover}
                alt="封面预览"
                className="mt-3 w-full h-40 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </Dialog>
  );
}
