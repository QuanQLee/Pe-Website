// src/pages/AdminDashboard.jsx  —— 仅展示核心逻辑
import React, { useEffect, useState } from 'react';
import api from '../api';
import EditModal from './EditModal';

  /* ⚠️ 关键：保存完成后的统一回调 —— 关闭弹窗 + 重新拉列表 */
  const handleSaved = () => {
    setModal({ open:false, initial:{} });
    load();
  };

export default function AdminDashboard() {
  const [active, setActive] = useState('blog');   // blog | project
  const [list,   setList]   = useState([]);
  const [modal,  setModal]  = useState({ open:false, initial:{} });

  const load = async () => {
    const { data } = await api.get(active === 'blog' ? '/blogs' : '/projects');
    setList(data);
  };
  useEffect(load, [active]);


  /* 删除 */
  const del = async id => {
    if (!confirm('确定删除？')) return;
    await api.delete(`/${active}s/${id}`);
    load();
  };

  return (
    <div className="p-6">
      {/* Tab 切换 */}
      <div className="space-x-4 mb-4">
        <button onClick={()=>setActive('blog')}    className={active==='blog'    ? 'tab-active':'tab'}>文章管理</button>
        <button onClick={()=>setActive('project')} className={active==='project' ? 'tab-active':'tab'}>项目管理</button>
      </div>

      {/* 列表 */}
      <div className="space-y-2">
        {list.map(item => (
          <div key={item._id} className="flex justify-between border p-3 rounded">
            <span>{active==='blog' ? item.title : item.name}</span>
            <div className="space-x-3">
              <button onClick={()=>setModal({open:true, initial:item})}>✏️ 编辑</button>
              <button onClick={()=>del(item._id)}>🗑️ 删除</button>
            </div>
          </div>
        ))}
        {list.length===0 && <p className="text-gray-500">暂无数据</p>}
      </div>

      {/* 新建按钮 */}
      <button
        onClick={()=>setModal({open:true, initial:{}})}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12 text-xl"
      >＋</button>

      {/* 弹窗编辑 */}
      <EditModal
        isOpen={modal.open}
        initial={modal.initial}
        type={active === 'blog' ? 'blog' : 'project'}
        onClose={()=>setModal({ open:false, initial:{} })}
        onSaved={handleSaved}     // ← 现在它确实存在
      />
    </div>
  );
}
