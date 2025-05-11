import { useEffect, useState } from 'react';
import clsx from 'clsx';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');    // 'blog' | 'project'
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEdit] = useState(null);

  const load = async () => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    const data = (await api.get(path)).data;
    setList(data);
  };

  useEffect(() => { load(); }, [tab]);

  const save = async data => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    if (editItem?._id) {
      await api.put(`${path}/${editItem._id}`, data);
    } else {
      await api.post(path, data);
    }
    setOpen(false);
    load();
  };

  const del = async id => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    if (confirm('Delete?')) {
      await api.delete(`${path}/${id}`);
      load();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map(t => (
          <button key={t}
            className={clsx('px-4 py-2 rounded-lg', t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}
            onClick={() => setTab(t)}
          >
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button onClick={() => { setEdit(null); setOpen(true); }}
          className="ml-auto btn-primary">＋ New</button>
      </div>

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
                <button onClick={() => { setEdit(item); setOpen(true); }}
                  className="btn-outline text-sm">✏︎</button>
                <button onClick={() => del(item._id)}
                  className="btn-danger text-sm">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
