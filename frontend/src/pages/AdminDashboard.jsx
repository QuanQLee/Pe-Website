import React, { useEffect, useState } from 'react';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab,   setTab]   = useState('blog');            // blog｜project
  const [list,  setList]  = useState([]);
  const [modal, setModal] = useState({open:false, item:{}});

  /* 拉取列表；任何 404 / CORS 都不会白屏 */
  const fetchList = async () => {
    try {
      const { data } = await api.get(tab === 'blog' ? '/blogs' : '/projects');
      setList(Array.isArray(data) ? data : []);
    } catch {
      setList([]);
    }
  };
  useEffect(fetchList, [tab]);

  /* 删除 */
  const remove = async id => {
    if (!confirm('确定删除？')) return;
    await api.delete(`/${tab}s/${id}`);
    fetchList();
  };

  /* 保存成功 → 刷新 + 关弹窗 */
  const handleSaved = () => {
    setModal({open:false, item:{}});
    fetchList();
  };

  return (
    <div className="p-6 space-y-6">
      {/* ---- TAB ---- */}
      <div className="space-x-4">
        {['blog','project'].map(t=>(
          <button key={t}
            onClick={()=>setTab(t)}
            className={tab===t?'tab-active':'tab'}>
            {t==='blog'?'文章管理':'项目管理'}
          </button>
        ))}
      </div>

      {/* ---- 列表 ---- */}
      {list.length===0
        ? <p className="text-gray-500">暂无数据</p>
        : list.map(i=>(
            <div key={i._id} className="flex justify-between border p-3 rounded">
              <span>{tab==='blog'?i.title:i.name}</span>
              <div className="space-x-3">
                <button onClick={()=>setModal({open:true,item:i})}>✏️编辑</button>
                <button onClick={()=>remove(i._id)}>🗑️删除</button>
              </div>
            </div>
          ))
      }

      {/* ---- 新建按钮 ---- */}
      <button
        onClick={()=>setModal({open:true,item:{}})}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12 rounded-full text-xl">
        ＋
      </button>

      {/* ---- 弹窗 ---- */}
      <EditModal
        isOpen={modal.open}
        onClose={()=>setModal({open:false,item:{}})}
        onSaved={handleSaved}
        type={tab}
        initial={modal.item}
      />
    </div>
  );
}
