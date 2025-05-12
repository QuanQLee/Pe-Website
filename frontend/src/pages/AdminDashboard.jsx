import { useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import api from '../api';
import EditModal from './EditModal';

export default function AdminDashboard() {
  const [tab, setTab] = useState('blog');          // blog | project
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);    // null=new
  const [open, setOpen] = useState(false);

  /* ---------- 拉数据 ---------- */
  const path = tab === 'blog' ? '/blogs' : '/projects';
  const reload = async () => {
    const { data } = await api.get(path);
    setRows(Array.isArray(data) ? data : data.blogs || data.projects || []);
  };
  useEffect(() => { reload(); }, [tab]);

  /* ---------- 保存 / 删除 ---------- */
  const save = async (form, file) => {
    const payload = { ...form };
    if (file) {                              // 可选：图片上传
      const fd = new FormData();
      fd.append('file', file);
      const { url } = (await api.post('/upload', fd)).data;
      payload.image = url;
    }
    editing?._id
      ? await api.put(`${path}/${editing._id}`, payload)
      : await api.post(path, payload);
    setOpen(false);
    reload();
  };
  const delOne = async id => {
    if (confirm('Delete?')) {
      await api.delete(`${path}/${id}`);
      reload();
    }
  };

  /* ---------- 表格列 ---------- */
  const columns = useMemo(() => [
    {
      header: '标题 / 名称',
      accessorFn: r => r.title ?? r.name,
    },
    {
      header: '日期',
      accessorFn: r => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      header: '操作',
      cell: ({ row }) => (
        <>
          <button onClick={() => { setEditing(row.original); setOpen(true); }}
                  className="btn-outline text-sm mr-2">编辑</button>
          <button onClick={() => delOne(row.original._id)}
                  className="btn-danger  text-sm">删除</button>
        </>
      ),
    },
  ], [tab]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* Tabs + New */}
      <div className="flex gap-4 mb-6">
        {['blog', 'project'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('px-4 py-2 rounded-lg',
              t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}>
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button className="ml-auto btn-primary"
          onClick={() => { setEditing(null); setOpen(true); }}>＋ New</button>
      </div>

      {/* Table */}
      <table className="w-full border collapse">
        <thead className="bg-gray-100">
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

      {/* 弹窗 */}
      <EditModal open={open} setOpen={setOpen}
                 initData={editing} type={tab} onSave={save} />
    </div>
  );
}
