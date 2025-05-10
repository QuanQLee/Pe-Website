import { useState, useEffect } from 'react';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  // 用一个对象来管理弹窗的状态
  const [modal, setModal] = useState({
    open: false,
    type: '',    // 'blog' 或 'project'
    data: null,  // 当前编辑的数据
  });

  // 拉取列表
  const load = () => {
    api.get('/blogs').then(r => setBlogs(r.data));
    api.get('/projects').then(r => setProjects(r.data));
  };
  useEffect(load, []);

  // 新建 / 编辑
  const openNew = t => setModal({ open: true, type: t, data: {} });
  const openEdit = (t, obj) => setModal({ open: true, type: t, data: obj });

  // 保存（新建或更新）
  const save = async values => {
    const t = modal.type;
    if (t === 'blog') {
      if (values._id) await api.put(`/blogs/${values._id}`, values);
      else await api.post('/blogs', values);
    } else {
      if (values._id) await api.put(`/projects/${values._id}`, values);
      else await api.post('/projects', values);
    }
    // 关闭弹窗并刷新列表
    setModal({ open: false, type: '', data: null });
    load();
  };

  // 删除
  const del = async (t, id) => {
    if (!confirm('确定要删除吗？')) return;
    await api.delete(`/${t}s/${id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">管理面板</h1>

      <div className="flex gap-4">
        <button
          className={tab === 'blogs' ? 'btn-primary' : 'btn-outline'}
          onClick={() => setTab('blogs')}
        >
          文章管理
        </button>
        <button
          className={tab === 'projects' ? 'btn-primary' : 'btn-outline'}
          onClick={() => setTab('projects')}
        >
          项目管理
        </button>
      </div>

      {tab === 'blogs' && (
        <>
          <button
            className="btn-primary mb-4"
            onClick={() => openNew('blog')}
          >
            新建文章
          </button>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2">标题</th>
                <th className="py-2">路径</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(b => (
                <tr key={b._id} className="border-t">
                  <td className="py-2">{b.title}</td>
                  <td className="py-2">{b.slug}</td>
                  <td className="py-2 text-right space-x-2">
                    <button
                      className="btn"
                      onClick={() => openEdit('blog', b)}
                    >
                      编辑
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => del('blog', b._id)}
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
            className="btn-primary mb-4"
            onClick={() => openNew('project')}
          >
            新建项目
          </button>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2">名称</th>
                <th className="py-2">简介</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.tagline}</td>
                  <td className="py-2 text-right space-x-2">
                    <button
                      className="btn"
                      onClick={() => openEdit('project', p)}
                    >
                      编辑
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => del('project', p._id)}
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

      {/* 关键：属性名要和 EditModal 一致 */}
      <EditModal
        isOpen={modal.open}
        type={modal.type}
        initial={modal.data}
        onClose={() => setModal({ open: false, type: '', data: null })}
        onSaved={save}
      />
    </div>
  );
}
