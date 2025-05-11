import { useEffect, useState, useMemo } from 'react';
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
  const [tab, setTab] = useState('blog');  // blog | project
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  /* 读取列表 --------------------------------------------------------- */
  const fetchList = async t => {
    const path = t === 'blog' ? '/blogs' : '/projects';
    const { data } = await api.get(path);
    setData(Array.isArray(data) ? data : data.blogs || data.projects || data.data || []);

  };
  useEffect(() => { fetchList(tab); }, [tab]);

  /* table 列定义 ----------------------------------------------------- */
  const columns = useMemo(() => [
    {
      id: 'title',                          // ★ 添加 id
      header: tab === 'blog' ? 'Title' : 'Name',
      accessorFn: row => row.title || row.name,
      cell: info => info.getValue(),          // ← ★ 让内容真正渲染
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: 'action',
      header: 'Action',
      cell: info => {
        const row = info.row.original;
        return (
          <div className="space-x-1">
            <button
              onClick={() => { setEditing(row); setOpen(true); }}
              className="btn-outline text-xs">✏︎
            </button>
            <button
              onClick={() => handleDelete(row._id)}
              className="btn-danger text-xs">🗑
            </button>
          </div>
        );
      },
    },
  ], [tab]);

  /* react-table 实例 -------------------------------------------------- */
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  /* CRUD ------------------------------------------------------------- */
  const handleDelete = async id => {
    if (!confirm('Delete?')) return;
    await api.delete(`${tab === 'blog' ? '/blogs' : '/projects'}/${id}`);
    fetchList(tab);
  };

  const handleSave = async form => {
    const path = tab === 'blog' ? '/blogs' : '/projects';
    if (editing?._id) await api.put(`${path}/${editing._id}`, form);
    else               await api.post(path, form);
    setOpen(false);
    fetchList(tab);
  };

  /* 组件返回 --------------------------------------------------------- */
  return (
    <div className="max-w-5xl mx-auto mt-10 px-2">
      {/* tabs & new */}
      <div className="flex gap-4 mb-6 items-center">
        {['blog', 'project'].map(t => (
          <button key={t}
            onClick={() => setTab(t)}
            className={clsx('px-4 py-2 rounded-lg',
              t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200')}>
            {t === 'blog' ? 'Posts' : 'Projects'}
          </button>
        ))}
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="ml-auto btn-primary">＋ New
        </button>
      </div>

      {/* table / 空状态 */}
      {data.length === 0 ? (
        <p className="text-gray-500">暂无{tab === 'blog' ? '文章' : '项目'}，点击右上角 New 新建。</p>
      ) : (
        <>
          <table className="w-full border collapse">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id}
                        className="p-2 cursor-pointer select-none"
                        onClick={h.column.getToggleSortingHandler()}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {{asc:' 🔼',desc:' 🔽'}[h.column.getIsSorted()] || ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(r => (
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

          {/* pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex justify-end mt-3 space-x-2">
              <button onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="btn-outline text-xs">Prev</button>
              <span className="text-sm self-center">
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <button onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="btn-outline text-xs">Next</button>
            </div>
          )}
        </>
      )}

      {/* edit modal */}
      <EditModal
        open={open}
        setOpen={setOpen}
        type={tab}
        initData={editing}
        onSave={handleSave}
      />
    </div>
  );
}
