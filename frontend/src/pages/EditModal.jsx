import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import MDEditor from '@uiw/react-md-editor'
import { useDropzone } from 'react-dropzone'
import api from '../api'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

export default function EditModal({
  isOpen = false,
  onClose,
  initial = {},
  type,
  onSaved,
}) {
  // 保证 open 一定是 boolean
  const openFlag = !!isOpen

  // 表单字段
  const [title, setTitle] = useState(initial.title || '')
  const [slug, setSlug] = useState(initial.slug || '')
  const [content, setContent] = useState(initial.content || '')
  const [cover, setCover] = useState(initial.coverImage || '')

  // 拖拽 / 上传封面
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: files => {
      // 本地预览
      setCover(URL.createObjectURL(files[0]))
      // 上传到后端 /upload
      const fd = new FormData()
      fd.append('file', files[0])
      api
        .post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(r => setCover(r.data.url))
        .catch(console.error)
    },
  })

  // initial 改变时重置表单
  useEffect(() => {
    setTitle(initial.title || '')
    setSlug(initial.slug || '')
    setContent(initial.content || '')
    setCover(initial.coverImage || '')
  }, [initial])

  // 点击保存
  const handleSave = async () => {
    const payload = { title, slug, content }
    if (cover) payload.coverImage = cover

    if (initial._id) {
      await api.put(`/${type}s/${initial._id}`, payload)
    } else {
      await api.post(`/${type}s`, payload)
    }

    onSaved({ ...initial, ...payload })
    onClose()
  }

  return (
    <Dialog
      open={openFlag}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />

      <div className="relative bg-white p-6 rounded-xl w-full max-w-2xl mx-4">
        <Dialog.Title className="text-2xl font-bold mb-4">
          {initial._id ? '编辑' : '新建'}
          {type === 'blog' ? '文章' : '项目'}
        </Dialog.Title>

        {/* 标题 & Slug */}
        <div className="space-y-4 mb-4">
          <div>
            <label className="block mb-1 font-medium">标题</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">路径 (Slug)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
          </div>
        </div>

        {/* Markdown 编辑 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">内容 (Markdown)</label>
          <MDEditor
            value={content}
            onChange={setContent}
            height={200}
          />
        </div>

        {/* 封面图上传 / 预览 */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">封面图</label>
          <div
            {...getRootProps()}
            className={`border-dashed border-2 rounded p-6 text-center cursor-pointer ${
              isDragActive ? 'border-primary-500' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {cover ? (
              <img
                src={cover}
                alt="cover"
                className="mx-auto max-h-40 object-contain"
              />
            ) : (
              <p>拖拽或点击上传图片</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button className="btn" onClick={onClose}>
            取消
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </Dialog>
  )
}
