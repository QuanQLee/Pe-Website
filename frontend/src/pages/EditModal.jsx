import { useEffect, useMemo, useState } from 'react';
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

/* 表格列定义 */
const makeColumns = tab => [
  {
    header: tab === 'blog' ? '标题' : '名称',
    accessorKey: tab === 'blog' ? 'title' : 'name',
  },
  { header: '日期', accessorFn: row => new Date(row.createdAt).toLocaleDateString() },
  {
    header: '操作',
    cell: ({ row, table }) => (
      <>
        <button onClick={() => table.options.meta.edit(row.original)} className="btn-outline text-sm mr-2">✏︎</button>
        <button onClick={() => table.options.meta.del(row.original._id)} className="btn-danger text-sm">🗑</button>
      </>
    ),
  },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');   // blog | project
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  /* 拉列表 */
  const fetchList = async t => {
    setLoading(true);
    const r = await api.get(t === 'blog' ? '/blogs' : '/projects');
    const arr = Array.isArray(r.data) ? r.data : r.data.blogs || r.data.projects || [];
    setData(arr);
    setLoading(false);
  };
  useEffect(() => { fetchList(tab); }, [tab]);

  /* 新建/编辑/删除 */
  const save = async form => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    editing?._id
      ? await api.put(`${path}/${editing._id}`, form)
      : await api.post(path, form);
    setModal(false);
    fetchList(tab);
  };
  const del = async id => {
    if (!confirm('Delete?')) return;
    await api.delete(`${tab === 'blog' ? '/blogs' : '/projects'}/${id}`);
    fetchList(tab);
  };

  /* react-table 实例 */
  const columns = useMemo(() => makeColumns(tab), [tab]);
  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: { edit: r => { setEditing(r); setModal(true); }, del },
  });

  return (
    <div className="max-w-6xl mx-auto mt-12">
      {/* Tab + New */}
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('px-4 py-2 rounded-lg',
              t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}>
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button onClick={() => { setEditing(null); setModal(true); }}
          className="ml-auto btn-primary">＋ New</button>
      </div>

      {/* 表格 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="p-3 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-6 text-center text-gray-400">加载中…</td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={3} className="p-6 text-center text-gray-400">暂无数据</td></tr>
            ) : table.getRowModel().rows.map(r => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                {r.getVisibleCells().map(c => (
                  <td key={c.id} className="p-3">
                    {flexRender(c.column.columnDef.cell ?? c.column.columnDef.accessorFn, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
          className="btn-outline">上一页</button>
        <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
          className="btn-outline">下一页</button>
      </div>

      {/* 弹窗编辑 */}
      <EditModal
        open={modalOpen}
        setOpen={setModal}
        initData={editing}
        type={tab}
        onSave={save}
      />
    </div>
  );
}
