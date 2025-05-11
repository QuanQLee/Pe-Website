import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  // 选中标签：blog / project
  const [tab, setTab] = useState('blog')
  // 列表数据
  const [data, setData] = useState([])
  // 分页
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 5

  // ① 拉取列表
  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/${tab === 'blog' ? 'blogs' : 'projects'}`
      )
      const list = await res.json()
      setData(list)
    })()
  }, [tab])

  // ② 删除
  const handleDelete = async id => {
    if (!window.confirm('确定删除?')) return
    await fetch(
      `${import.meta.env.VITE_API_URL}/${tab === 'blog' ? 'blogs' : 'projects'}/${id}`,
      { method: 'DELETE' }
    )
    setData(prev => prev.filter(item => item._id !== id))
  }

  return (
    <main className="p-6 max-w-screen-lg mx-auto">
      {/* 顶部切换按钮 */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === 'blog' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('blog')}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'project' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('project')}
        >
          Projects
        </button>
        {/* TODO: 新建弹窗 */}
        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded">+ New</button>
      </div>

      {/* 表格 */}
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
                <button className="text-blue-600" /* onClick={openEdit(row)} */>编辑</button>
                <button className="text-red-500" onClick={() => handleDelete(row._id)}>
                  删除
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="3" className="py-6 text-gray-400">
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 简单分页示例 */}
      <div className="mt-4">
        <button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex(p => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          上一页
        </button>
        <span className="mx-2">
          {pageIndex + 1} / {Math.max(1, Math.ceil(data.length / pageSize))}
        </span>
        <button
          disabled={(pageIndex + 1) * pageSize >= data.length}
          onClick={() => setPageIndex(p => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          下一页
        </button>
      </div>
    </main>
  )
}
