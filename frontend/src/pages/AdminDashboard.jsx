import { useState, useEffect } from 'react'
import api from '../api'
import EditModal from './EditModal'

export default function AdminDashboard() {
  const [tab, setTab] = useState('blogs')
  const [blogs, setBlogs] = useState([])
  const [projects, setProjects] = useState([])
  // modalProps.open 一定是 boolean，type 要么 'blog' 要么 'project'
  const [modalProps, setModalProps] = useState({ open: false, type: '', initial: {} })

  // 加载数据
  const load = () => {
    api.get('/blogs').then(r => setBlogs(r.data))
    api.get('/projects').then(r => setProjects(r.data))
  }
  useEffect(load, [])

  const openNew = type =>
    setModalProps({ open: true, type, initial: {} })
  const openEdit = (type, obj) =>
    setModalProps({ open: true, type, initial: obj })

  const handleSave = async data => {
    const { type } = modalProps
    if (type === 'blog') {
      if (data._id) await api.put(`/blogs/${data._id}`, data)
      else await api.post('/blogs', data)
    } else {
      if (data._id) await api.put(`/projects/${data._id}`, data)
      else await api.post('/projects', data)
    }
    setModalProps({ ...modalProps, open: false })
    load()
  }

  const handleDelete = async (type, id) => {
    if (!confirm('确定要删除吗？')) return
    await api.delete(`/${type}s/${id}`)
    load()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">管理面板</h1>

      <div className="flex space-x-4">
        <button
          className={tab === 'blogs' ? 'btn-active' : 'btn'}
          onClick={() => setTab('blogs')}
        >
          文章
        </button>
        <button
          className={tab === 'projects' ? 'btn-active' : 'btn'}
          onClick={() => setTab('projects')}
        >
          项目
        </button>
      </div>

      {tab === 'blogs' && (
        <>
          <button
            className="btn-primary"
            onClick={() => openNew('blog')}
          >
            新建文章
          </button>
          <table className="w-full table-auto text-left mt-4">
            <thead>
              <tr>
                <th className="p-2">标题</th>
                <th className="p-2">Slug</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(b => (
                <tr key={b._id} className="border-t">
                  <td className="p-2">{b.title}</td>
                  <td className="p-2">{b.slug}</td>
                  <td className="p-2 space-x-2 text-right">
                    <button className="btn" onClick={() => openEdit('blog', b)}>
                      编辑
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete('blog', b._id)}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'projects' && (
        <>
          <button
            className="btn-primary"
            onClick={() => openNew('project')}
          >
            新建项目
          </button>
          <table className="w-full table-auto text-left mt-4">
            <thead>
              <tr>
                <th className="p-2">名称</th>
                <th className="p-2">Tagline</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.tagline}</td>
                  <td className="p-2 space-x-2 text-right">
                    <button
                      className="btn"
                      onClick={() => openEdit('project', p)}
                    >
                      编辑
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete('project', p._id)}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <EditModal
        isOpen={modalProps.open}
        type={modalProps.type}
        initial={modalProps.initial}
        onClose={() =>
          setModalProps({ open: false, type: '', initial: {} })
        }
        onSaved={handleSave}
      />
    </div>
  )
}
