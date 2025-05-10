// src/pages/EditModal.jsx
import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import MDEditor from '@uiw/react-md-editor'
import { useDropzone } from 'react-dropzone'
import api from '../api'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

export default function EditModal({ isOpen = false, onClose, initial, type, onSaved }) {
  const openFlag = !!isOpen;  // 确保一定是 boolean
  // type = 'blog' | 'project'
  const [title, setTitle]     = useState(initial?.title || '')
  const [slug, setSlug]       = useState(initial?.slug  || '')
  const [content, setContent] = useState(initial?.content || '')
  const [cover, setCover]     = useState(initial?.coverImage || '')

  // 拖拽 / 选择图片逻辑
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: files => {
      // 本地预览
      setCover(URL.createObjectURL(files[0]))
      // 上传到后端 /api/upload
      const fd = new FormData()
      fd.append('file', files[0])
      api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(r => {
        setCover(r.data.url)
      })
    }
  })

  // initial 变更时重置表单
  useEffect(() => {
    setTitle(initial?.title || '')
    setSlug(initial?.slug  || '')
    setContent(initial?.content || '')
    setCover(initial?.coverImage || '')
  }, [initial])

  // 保存按钮
  const handleSave = async () => {
    const payload = { title, slug, content }
    if (cover) payload.coverImage = cover

    if (initial?.id) {
      await api.put(`/${type}s/${initial.id}`, payload)
    } else {
      await api.post(`/${type}s`, payload)
    }
    onSaved()
    onClose()
  }

  return (
    <Dialog open={openFlag} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />

      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl mx-4">
        <Dialog.Title className="text-2xl font-bold mb-4">
          {initial ? '编辑' : '新增'}{type === 'blog' ? '文章' : '项目'}
        </Dialog.Title>

        {/* 标题 & Slug */}
        <div className="mb-4 space-y-2">
          <div>
            <label className="block font-medium mb-1">标题</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">路径 (slug)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
          </div>
        </div>

        {/* Markdown 编辑器 (仅 blog) */}
        {type === 'blog' && (
          <div className="mb-4" data-color-mode="light">
            <MDEditor
              value={content}
              onChange={setContent}
              height={300}
            />
          </div>
        )}

        {/* 项目描述 (仅 project) */}
        {type === 'project' && (
          <div className="mb-4">
            <label className="block font-medium mb-1">描述</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
        )}

        {/* 封面图上传 */}
        <div className="mb-6">
          <label className="block font-medium mb-1">封面图片</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:border-gray-400"
          >
            <input {...getInputProps()} />
            {isDragActive ? '释放以上传' : '点击或拖拽图片到此处上传'}
          </div>
          {cover && (
            <img
              src={cover}
              alt="封面预览"
              className="mt-3 w-full max-h-40 object-cover rounded"
            />
          )}
        </div>

        {/* 按钮 */}
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </Dialog>
  )
}
