import { useEffect, useState } from 'react';
import clsx from 'clsx';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');   // blog | project
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  /* ---------- 拉数据 ---------- */
  const load = async t => {
    const { data } = await api.get(t === 'blog' ? '/blogs' : '/projects');
    // 兼容后端返回数组 / {blogs:[]} / {projects:[]}
    setList(Array.isArray(data) ? data : data.blogs || data.projects || []);
  };
  useEffect(() => { load('blog'); }, []);
  useEffect(() => { load(tab);    }, [tab]);

  /* ---------- 新建 / 编辑 ---------- */
  const save = async values => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    if (editItem?._id) {
      await api.put(`${path}/${editItem._id}`, values);
    } else {
      await api.post(path, values);
    }
    setOpen(false);
    load(tab);
  };

  /* ---------- 删除 ---------- */
  const remove = async id => {
    if (!confirm('Delete?')) return;
    const path = tab === 'blog' ? '/blogs' : '/projects';
    await api.delete(`${path}/${id}`);
    load(tab);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* --- 顶部按钮 --- */}
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map(t => (
          <button key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2 rounded-lg',
              t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}>
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button
          onClick={() => { setEditItem(null); setOpen(true); }}
          className="ml-auto btn-primary">＋ New</button>
      </div>

      {/* --- 列表 --- */}
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 w-1/2 text-left">标题 / 名称</th>
            <th className="p-2 text-left">日期</th>
            <th className="p-2 w-24 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={3} className="p-6 text-center text-gray-500">暂无数据</td></tr>
          ) : list.map(item => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item.title || item.name}</td>
              <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="p-2">
                <button
                  onClick={() => { setEditItem(item); setOpen(true); }}
                  className="btn-outline text-sm mr-2">✏</button>
                <button
                  onClick={() => remove(item._id)}
                  className="btn-danger text-sm">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- 弹窗 --- */}
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
