import { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import api from '../api';
import clsx from 'clsx';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEdit] = useState(null);

  const fetchList = async t => {
    const { data } = await api.get(t === 'blog' ? '/blogs' : '/projects');
    setData(Array.isArray(data) ? data : data.blogs || data.projects || []);
  };
  useEffect(() => { fetchList('blog'); }, []);
  useEffect(() => { fetchList(tab);   }, [tab]);

  const save = async form => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    editItem?._id
      ? await api.put(`${path}/${editItem._id}`, form)
      : await api.post(path, form);
    setOpen(false);
    fetchList(tab);
  };
  const del = async id => {
    if (!confirm('Delete?')) return;
    await api.delete(`${tab === 'blog' ? '/blogs' : '/projects'}/${id}`);
    fetchList(tab);
  };

  /* 列定义 */
  const columns = useMemo(() => [
    {
      header: '标题',
      cell: ({ row }) => row.original.title ?? row.original.name,
    },
    {
      header: '日期',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: '操作',
      cell: ({ row }) => (
        <>
          <button
            onClick={() => { setEdit(row.original); setOpen(true); }}
            className="btn-outline text-sm mr-2">✏︎</button>
          <button
            onClick={() => del(row.original._id)}
            className="btn-danger text-sm">🗑</button>
        </>
      ),
    },
  ], [tab]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* Tabs & New */}
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map(t => (
          <button key={t}
            onClick={() => setTab(t)}
            className={clsx('px-4 py-2 rounded-lg',
              t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}>
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button onClick={() => { setEdit(null); setOpen(true); }}
          className="ml-auto btn-primary">＋ New</button>
      </div>

      {/* Table */}
      <table className="w-full border collapse">
        <thead className="bg-gray-100 text-left">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="p-2">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr><td colSpan={3} className="p-6 text-center text-gray-500">暂无数据</td></tr>
          ) : table.getRowModel().rows.map(r => (
            <tr key={r.id} className="border-t">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="p-2">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
          className="btn-outline">上一页</button>
        <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
          className="btn-outline">下一页</button>
      </div>

      {/* Modal */}
      <EditModal open={open} setOpen={setOpen}
                 initData={editItem} type={tab} onSave={save}/>
    </div>
  );
}
