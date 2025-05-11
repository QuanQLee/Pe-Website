import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [bResp, pResp] = await Promise.all([
        axios.get(import.meta.env.VITE_API_BASE + '/blogs'),
        axios.get(import.meta.env.VITE_API_BASE + '/projects'),
      ]);
      setBlogs(bResp.data);
      setProjects(pResp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = item => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing({});
    setModalOpen(true);
  };

  const handleSave = async (type, data) => {
    try {
      if (data._id) {
        await axios.put(`${import.meta.env.VITE_API_BASE}/${type}/${data._id}`, data);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE}/${type}`, data);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const items = tab === 'blogs' ? blogs : projects;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">后台管理</h1>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setTab('blogs')} className={tab==='blogs'?'font-semibold':'text-gray-600'}>文章</button>
        <button onClick={() => setTab('projects')} className={tab==='projects'?'font-semibold':'text-gray-600'}>项目</button>
      </div>
      <button onClick={handleCreate} className="mb-4 px-3 py-1 bg-blue-500 text-white rounded">新建{tab==='blogs'?'文章':'项目'}</button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">标题</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{item.title}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit({...item, type: tab})} className="px-2 py-1 bg-green-500 text-white rounded">编辑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <EditModal
          type={tab}
          item={editing}
          onClose={() => setModalOpen(false)}
          onSave={data => handleSave(tab, data)}
        />
      )}
    </div>
  );
}
