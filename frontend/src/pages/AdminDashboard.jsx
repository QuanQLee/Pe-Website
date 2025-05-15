import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 新增
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

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate(); // 新增

  // -------- 登录拦截逻辑 start --------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login'); // 跳转到你的登录页面
    }
  }, [navigate]);
  // -------- 登录拦截逻辑 end --------

  // ...其余代码不变...

  // 获取一个有效的 slug 或 _id（优先 slug，且不能为 "" 或 undefined）
  const getIdOrSlug = (item) => {
    if (item && item.slug && typeof item.slug === 'string' && item.slug.trim() !== '') {
      return item.slug;
    }
    return item._id;
  };

  // fetch list whenever tab changes or after save/delete
  const fetchList = async () => {
    setLoading(true);
    const url = tab === 'blog' ? '/blogs' : '/projects';
    const res = await api.get(url);
    const list = Array.isArray(res.data) ? res.data : [];
    setData(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, [tab]);

  // Save (create or update)
  const handleSave = async (form) => {
    const base = tab === 'blog' ? '/blogs' : '/projects';
    if (editing && (editing._id || editing.slug)) {
      // update
      const idOrSlug = getIdOrSlug(editing);
      await api.put(`${base}/${idOrSlug}`, form);
    } else {
      // create
      await api.post(base, form);
    }
    setModalOpen(false);
    setEditing(null);
    fetchList();
  };

  // Delete
  const handleDelete = async (orig) => {
    const idOrSlug = getIdOrSlug(orig);
    if (!confirm('确认删除此条记录？')) return;
    const base = tab === 'blog' ? '/blogs' : '/projects';
    await api.delete(`${base}/${idOrSlug}`);
    setData((prev) => prev.filter((it) => getIdOrSlug(it) !== idOrSlug));
  };

  // columns
  const columns = useMemo(
    () => [
      { header: tab === 'blog' ? '标题' : '名称', accessorKey: tab === 'blog' ? 'title' : 'name' },
      tab === 'blog'
        ? { header: '简介', accessorKey: 'summary' }
        : { header: '简介', accessorKey: 'tagline' },
      tab === 'blog'
        ? { header: '标签', accessorFn: row => row.tags }
        : { header: '描述', accessorKey: 'description' },
      tab === 'blog'
        ? { header: '封面', accessorFn: row => row.coverImg ? <img src={row.coverImg} alt="" style={{ width: 40 }} /> : '' }
        : { header: '封面', accessorFn: row => row.coverImg ? <img src={row.coverImg} alt="" style={{ width: 40 }} /> : '' },
      { header: '日期', accessorFn: (row) => new Date(row.createdAt).toLocaleDateString() },
      {
        header: '操作',
        cell: ({ row }) => (
          <>
            <button
              onClick={() => { setEditing(row.original); setModalOpen(true); }}
              className="btn-outline mr-2"
            >✏︎</button>
            <button
              onClick={() => handleDelete(row.original)}
              className="btn-danger"
            >🗑</button>
          </>
        ),
      },
    ],
    [tab]
  );

  // table instance
  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex: 0, pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-6xl mx-auto mt-12">
      {/* Tabs & New */}
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setEditing(null); }}
            className={clsx('px-4 py-2 rounded-lg', {
              'bg-blue-600 text-white': t === tab,
              'bg-gray-200': t !== tab,
            })}
          >
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="ml-auto btn-primary"
        >
          ＋ New
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="p-3 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-400">
                  加载中…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorFn, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn-outline">
          上一页
        </button>
        <span>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn-outline">
          下一页
        </button>
      </div>

      {/* Edit Modal */}
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
