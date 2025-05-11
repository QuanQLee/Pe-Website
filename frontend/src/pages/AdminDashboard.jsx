import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog')
  const [data, setData] = useState([])
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 5

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formState, setFormState] = useState({ title: '', name: '', content: '' })

  // 拉取列表
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}`
        )
        const list = await res.json()
        setData(list)
        setPageIndex(0)
      } catch (err) {
        console.error('列表拉取失败', err)
      }
    })()
  }, [tab])

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormState({
        title: item.title || '',
        name: item.name || '',
        content: item.content || item.description || ''
      })
    } else {
      setEditingItem(null)
      setFormState({ title: '', name: '', content: '' })
    }
    setModalOpen(true)
  }
  const closeModal = () => setModalOpen(false)

  // 新建/编辑提交
  const handleSubmit = async e => {
    e.preventDefault()
    const endpoint = `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}`
    const payload =
      tab === 'blog'
        ? { title: formState.title, content: formState.content }
        : { name: formState.name, description: formState.content }

    try {
      let saved
      if (editingItem) {
        const res = await fetch(`${endpoint}/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        saved = await res.json()
        setData(list => list.map(d => (d._id === saved._id ? saved : d)))
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        saved = await res.json()
        setData(list => [saved, ...list])
      }
      closeModal()
    } catch (err) {
      console.error('保存失败', err)
    }
  }

  // 删除
  const handleDelete = async id => {
    if (!window.confirm('确定删除？')) return
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE}/${tab === 'blog' ? 'blogs' : 'projects'}/${id}`,
        { method: 'DELETE' }
      )
      setData(list => list.filter(item => item._id !== id))
    } catch (err) {
      console.error('删除失败', err)
    }
  }

  return (
    <main className="p-6 max-w-screen-lg mx-auto">
      <div className="flex gap-4 mb-4">
        {['blog', 'project'].map(t => (
          <button
            key={t}
            className={`px-4 py-2 rounded ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab(t)}
          >
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => openModal(null)}
        >
          + New
        </button>
      </div>

      <table className="w-full border text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2">标题</th>
            <th className="py-2">日期</th>
            <th className="py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map(row => (
            <tr key={row._id} className="border-t">
              <td className="py-2">{row.title || row.name}</td>
              <td className="py-2">{new Date(row.createdAt).toLocaleDateString()}</td>
              <td className="py-2 space-x-2">
                <button className="text-blue-600" onClick={() => openModal(row)}>
                  编辑
                </button>
                <button className="text-red-500" onClick={() => handleDelete(row._id)}>
                  删除
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="3" className="py-6 text-gray-400">暂无数据</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center">
        <button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex(i => i - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          上一页
        </button>
        <span className="mx-2">
          {pageIndex + 1} / {Math.max(1, Math.ceil(data.length / pageSize))}
        </span>
        <button
          disabled={(pageIndex + 1) * pageSize >= data.length}
          onClick={() => setPageIndex(i => i + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          下一页
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? '编辑 ' : '新建 '}
              {tab === 'blog' ? '文章' : '项目'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'blog' ? (
                <>
                  <div>
                    <label className="block mb-1">标题</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={formState.title}
                      onChange={e => setFormState(s => ({ ...s, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">内容</label>
                    <ReactQuill
                      theme="snow"
                      value={formState.content}
                      onChange={val => setFormState(s => ({ ...s, content: val }))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-1">名称</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={formState.name}
                      onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">描述</label>
                    <textarea
                      className="w-full border p-2 rounded"
                      rows={6}
                      value={formState.content}
                      onChange={e => setFormState(s => ({ ...s, content: e.target.value }))}
                      required
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">
                  取消
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
