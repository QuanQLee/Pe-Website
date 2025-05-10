import React, { useEffect, useState } from 'react';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [active, setActive] = useState('blog');      // 'blog' | 'project'
  const [list, setList]     = useState([]);
  const [modal, setModal]   = useState({ open:false, initial:{} });

  /* 拉取列表 */
  const load = async () => {
    const path = active === 'blog' ? '/blogs' : '/projects';
    const { data } = await api.get(path);
    setList(data);
  };
  useEffect(load, [active]);

  /* 保存成功回调 */
  const handleSaved = () => {
    setModal({ open:false, initial:{} });
    load();
  };

  /* 删除 */
  const del = async id => {
    if (!confirm('确定删除吗？')) return;
    await api.delete(`/${active}s/${id}`);
    load();
  };

  /* 列表行渲染 */
  const Row = ({ item }) => (
    <div className="flex justify-between border p-3 rounded">
      <span>{active === 'blog' ? item.title : item.name}</span>
      <div className="space-x-3">
        <button onClick={()=>setModal({open:true, initial:item})}>✏️ 编辑</button>
        <button onClick={()=>del(item._id)}>🗑️ 删除</button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Tab */}
      <div className="space-x-4 mb-4">
        <button className={active==='blog'?'tab-active':'tab'}    onClick={()=>setActive('blog')}>文章管理</button>
        <button className={active==='project'?'tab-active':'tab'} onClick={()=>setActive('project')}>项目管理</button>
      </div>

      {/* 列表 */}
      <div className="space-y-2">
        {list.map(item => <Row key={item._id} item={item} />)}
        {list.length === 0 && <p className="text-gray-500">暂无数据</p>}
      </div>

      {/* 新建按钮 */}
      <button onClick={()=>setModal({open:true, initial:{}})} className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12 text-xl">＋</button>

      {/* 弹窗 */}
      <EditModal
        isOpen={modal.open}
        initial={modal.initial}
        type={active}
        onClose={()=>setModal({open:false, initial:{}})}
        onSaved={handleSaved}
      />
    </div>
  );
}