import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import clsx from 'clsx';
import api from '../api';
import EditModal from './EditModal';

const TABS = [
  { key: 'blog', label: '文章管理' },
  { key: 'project', label: '项目管理' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // 获取有效 slug 或 _id
  const getIdOrSlug = (item) => {
    if (item && item.slug && typeof item.slug === 'string' && item.slug.trim() !== '') {
      return item.slug;
    }
    return item._id;
  };

  // 获取数据
  const fetchList = async () => {
    setLoading(true);
    const url = tab === 'blog' ? '/blogs' : '/projects';
    const res = await api.get(url);
    setData(Array.isArray(res.data) ? res.data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, [tab]);

  // 保存
  const handleSave = async (form) => {
    const base = tab === 'blog' ? '/blogs' : '/projects';
    if (editing && (editing._id || editing.slug)) {
      const idOrSlug = getIdOrSlug(editing);
      await api.put(`${base}/${idOrSlug}`, form);
    } else {
      await api.post(base, form);
    }
    setModalOpen(false);
    setEditing(null);
    fetchList();
  };

  // 删除
  const handleDelete = async (orig) => {
    const idOrSlug = getIdOrSlug(orig);
    if (!window.confirm('确定要删除吗？删除后无法恢复。')) return;
    const base = tab === 'blog' ? '/blogs' : '/projects';
    await api.delete(`${base}/${idOrSlug}`);
    setData((prev) => prev.filter((it) => getIdOrSlug(it) !== idOrSlug));
  };

  // 表格列定义
const columns = useMemo(() => {
  if (tab === 'blog') {
    return [
      { header: '#', cell: ({ row }) => row.index + 1 },
      { header: '封面', accessorFn: row => row.coverImg ? <img src={row.coverImg} alt="" style={{ width: 50, borderRadius: 4 }} /> : <span className="text-gray-300">无</span> },
      { header: '标题', accessorKey: 'title' },
      { header: '标签', accessorFn: row => row.tags || '' },
      { header: '简介', accessorKey: 'summary' },
      { header: '更新时间', accessorFn: row => row.updatedAt ? new Date(row.updatedAt).toLocaleString() : (row.createdAt ? new Date(row.createdAt).toLocaleString() : '-') },
      {
        header: '操作',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(row.original); setModalOpen(true); }}
              className="btn-outline"
              title="编辑"
            >编辑</button>
            <button
              onClick={() => handleDelete(row.original)}
              className="btn-danger"
              title="删除"
            >删除</button>
          </div>
        ),
      },
    ];
  }
  // 重点：项目管理 columns 更专业
  return [
    { header: '#', cell: ({ row }) => row.index + 1 },
    { header: '封面', accessorFn: row => row.coverImg ? <img src={row.coverImg} alt="" style={{ width: 50, borderRadius: 4 }} /> : <span className="text-gray-300">无</span> },
    { header: '名称', accessorKey: 'name' },
    { header: '简介', accessorKey: 'tagline' },
    { header: '描述', accessorFn: row => (row.description?.length > 30 ? <span title={row.description}>{row.description.slice(0, 30)}...</span> : row.description) },
    { header: '链接', accessorFn: row => row.link ? <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">访问</a> : <span className="text-gray-300">-</span> },
    { header: '完成日期', accessorFn: row => row.finishedAt ? new Date(row.finishedAt).toLocaleDateString() : (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-') },
    {
      header: '操作',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setEditing(row.original); setModalOpen(true); }}
            className="btn-outline"
            title="编辑"
          >编辑</button>
          <button
            onClick={() => handleDelete(row.original)}
            className="btn-danger"
            title="删除"
          >删除</button>
        </div>
      ),
    },
  ];
}, [tab]);

  // 表格实例
  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex: 0, pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto mt-10">
      {/* 工具栏 */}
      <div className="flex items-center mb-6">
        <div className="flex gap-2">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setEditing(null); }}
              className={clsx(
                'px-6 py-2 rounded-full font-medium transition-all',
                t.key === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >{t.label}</button>
          ))}
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="ml-auto btn-primary"
        >＋ 新建{tab === 'blog' ? '文章' : '项目'}</button>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 rounded text-sm border border-gray-300 hover:bg-gray-100"
        >退出登录</button>
      </div>

      {/* 数据表格 */}
      <div className="border rounded-lg overflow-x-auto bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="p-3 text-left font-semibold">{flexRender(h.column.columnDef.header, h.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-400">加载中…</td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-400">暂无数据</td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t hover:bg-blue-50/20">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3 align-middle">{flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorFn, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn-outline">上一页</button>
        <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn-outline">下一页</button>
      </div>

      {/* 编辑弹窗 */}
      {modalOpen && (
        <EditModal
          type={tab}
          initialForm={editing || {}}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
