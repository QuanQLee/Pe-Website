// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import api        from '../api';
import EditModal  from './EditModal';

export default function AdminDashboard() {
  /* ---------------- 状态 ---------------- */
  const [active, setActive] = useState('blog');           // blog | project
  const [list,   setList]   = useState([]);               // 当前列表
  const [modal,  setModal]  = useState({ open:false, initial:{} });

  /* ---------------- 拉取列表 ---------------- */
  const load = async () => {
    const { data } = await api.get(active === 'blog' ? '/blogs' : '/projects');
    setList(data);
  };
  useEffect(load, [active]);              // 切 tab 时重新加载

  /* ---------------- 保存成功回调 ---------------- */
  const handleSaved = () => {
    setModal({ open:false, initial:{} }); // 关闭弹窗
    load();                               // 重新拉列表
  };

  /* ---------------- 删除 ---------------- */
  const del = async id => {
    if (!confirm('确定删除？')) return;
    await api.delete(`/${active}s/${id}`);
    load();
  };

  /* ---------------- 组件渲染 ---------------- */
  return (
    <div className="p-6">
      {/* Tab 切换 */}
      <div className="space-x-4 mb-4">
        <button
          onClick={()=>setActive('blog')}
          className={active==='blog' ? 'tab-active' : 'tab'}
        >
          文章管理
        </button>
        <button
          onClick={()=>setActive('project')}
          className={active==='project' ? 'tab-active' : 'tab'}
        >
          项目管理
        </button>
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
        {list.length === 0 && <p className="text-gray-500">暂无数据</p>}
      </div>

      {/* 新建按钮 */}
      <button
        onClick={()=>setModal({open:true, initial:{}})}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12 text-xl"
      >＋</button>

      {/* 编辑弹窗 */}
      <EditModal
        isOpen={modal.open}
        initial={modal.initial}
        type={active === 'blog' ? 'blog' : 'project'}
        onClose={()=>setModal({ open:false, initial:{} })}
        onSaved={handleSaved}                 {/* 现在函数确实存在 */}
      />
    </div>
  );
}
