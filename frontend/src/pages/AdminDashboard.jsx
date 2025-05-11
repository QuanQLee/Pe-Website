import { useEffect, useState } from 'react';
import clsx from 'clsx';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');     // 'blog' | 'project'
  const [list, setList] = useState(null);     // null=loading, []=empty
  const [open, setOpen] = useState(false);
  const [editItem, setEdit] = useState(null);

  // 拉数据
  const load = async (type = tab) => {
    const path = type === 'blog' ? '/blogs' : '/projects';
    const { data } = await api.get(path);
    // 既兼容数组也兼容 {blogs:[…]} / {projects:[…]}
    const arr =
      Array.isArray(data)
        ? data
        : data.blogs || data.projects || data.data || [];
    setList(arr);
  };

  // ‼️ 首次渲染也拉一次
  useEffect(() => { load('blog'); }, []);

  // 切换 Tab 时拉对应列表
  useEffect(() => { load(tab); }, [tab]);

  // 保存（新增 / 编辑）
  const save = async data => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    if (editItem?._id) {
      await api.put(`${path}/${editItem._id}`, data);
    } else {
      await api.post(path, data);
    }
    setOpen(false);
    load();                // 保存后刷新
  };

  // 删除
  const del = async id => {
    if (!confirm('Delete?')) return;
    const path = tab === 'blog' ? '/blogs' : '/projects';
    await api.delete(`${path}/${id}`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* 顶部按钮 */}
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map(t => (
          <button key={t}
            onClick={() => setTab(t)}
            className={clsx('px-4 py-2 rounded-lg',
              t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}
          >
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button
          onClick={() => { setEdit(null); setOpen(true); }}
          className="ml-auto btn-primary">＋ New
        </button>
      </div>

      {/* 列表区域 */}
      {list === null ? (
        <p className="text-gray-500">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">暂无{tab === 'blog' ? '文章' : '项目'}，点击右上角 New 新建。</p>
      ) : (
        <table className="w-full border collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 w-1/2">Title / Name</th>
              <th className="p-2">Date</th>
              <th className="p-2 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{item.title || item.name}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => { setEdit(item); setOpen(true); }}
                    className="btn-outline text-sm">✏︎
                  </button>
                  <button
                    onClick={() => del(item._id)}
                    className="btn-danger text-sm">🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 弹窗 */}
      <EditModal
        open={open}
        setOpen={setOpen}
        initData={editItem}
        type={tab}
        onSave={save}
      />
    </div>
  );
}
